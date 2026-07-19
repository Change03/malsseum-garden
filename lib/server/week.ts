import { and, asc, eq, getTableColumns } from "drizzle-orm";
import { getDb } from "@/db";
import {
  campaigns,
  completions,
  contentVariants,
  devotionalDays,
  participants,
} from "@/db/schema";
import {
  GARDEN_COMPLETION_GOAL,
  getGrowthProgress,
} from "@/lib/domain/growth";
import { getCampaignWeekNumber } from "@/lib/domain/campaign-clock";
import type { Viewer } from "./auth";
import { CAMPAIGN_ID, CAMPAIGN_WEEKS, POLL_AFTER_MS } from "./constants";
import { ensureDatabase } from "./database";
import { getCampaignPhase, toKstDate } from "./time";

export async function buildWeekPayload(viewer: Viewer, now = new Date()) {
  await ensureDatabase();
  const db = getDb();
  const [campaignRows, participantRows, dayRows, completionRows, variantRows] =
    await Promise.all([
      db.select().from(campaigns).where(eq(campaigns.id, CAMPAIGN_ID)).limit(1),
      db
        .select({
          id: participants.id,
          name: participants.name,
          sortOrder: participants.sortOrder,
          consentedAt: participants.consentedAt,
        })
        .from(participants)
        .where(
          and(
            eq(participants.campaignId, CAMPAIGN_ID),
            eq(participants.active, true),
          ),
        )
        .orderBy(asc(participants.sortOrder)),
      db
        .select()
        .from(devotionalDays)
        .where(eq(devotionalDays.campaignId, CAMPAIGN_ID))
        .orderBy(asc(devotionalDays.dayOrder)),
      db
        .select(getTableColumns(completions))
        .from(completions)
        .innerJoin(
          participants,
          eq(completions.participantId, participants.id),
        )
        .innerJoin(
          devotionalDays,
          eq(completions.dayId, devotionalDays.id),
        )
        .where(
          and(
            eq(participants.campaignId, CAMPAIGN_ID),
            eq(devotionalDays.campaignId, CAMPAIGN_ID),
          ),
        ),
      db
        .select(getTableColumns(contentVariants))
        .from(contentVariants)
        .innerJoin(
          devotionalDays,
          eq(contentVariants.dayId, devotionalDays.id),
        )
        .where(
          and(
            eq(contentVariants.published, true),
            eq(devotionalDays.campaignId, CAMPAIGN_ID),
          ),
        ),
    ]);

  const campaign = campaignRows[0];
  if (!campaign) throw new Error("Campaign is unavailable");

  const today = toKstDate(now);
  const phase = getCampaignPhase(now);
  const completedRows = completionRows.filter((row) => row.completed);
  const completedSet = new Set(
    completedRows.map((row) => `${row.participantId}:${row.dayId}`),
  );
  const weeks = CAMPAIGN_WEEKS.map((week) => {
    const dayIds = new Set<string>(week.dayIds);
    const completedCount = completedRows.filter((row) =>
      dayIds.has(row.dayId),
    ).length;
    const growth = getGrowthProgress(completedCount);
    return {
      number: week.number,
      label: week.label,
      startDate: week.startDate,
      endDate: week.endDate,
      dayIds: [...week.dayIds],
      garden: {
        weekNumber: week.number,
        completedCount,
        totalCount: GARDEN_COMPLETION_GOAL,
        possibleCount: participantRows.length * week.dayIds.length,
        stageIndex: growth.stageIndex,
        label: growth.stage.label,
        progress: Math.min(1, completedCount / GARDEN_COMPLETION_GOAL),
        percentToNext: growth.percentToNext,
        nextLabel: growth.nextStage?.label ?? null,
        remaining: growth.remaining,
      },
    };
  });
  const activeWeekNumber = getCampaignWeekNumber(now);
  const activeWeek = weeks.find((week) => week.number === activeWeekNumber) ?? weeks[0];
  const growth = getGrowthProgress(activeWeek.garden.completedCount);
  const todayDay = dayRows.find((day) => day.date === today) ?? null;
  const todayCompleted = todayDay
    ? completedRows.filter((row) => row.dayId === todayDay.id).length
      : 0;
  const serializedVariants = variantRows.map((variant) =>
    serializeVariant(variant, today),
  );

  const orderedParticipants =
    viewer.role === "member"
      ? [
          ...participantRows.filter((row) => row.id === viewer.participantId),
          ...participantRows.filter((row) => row.id !== viewer.participantId),
        ]
      : participantRows;

  return {
    phase,
    currentUser: {
      id: viewer.participantId ?? "admin",
      name: viewer.name,
      role: viewer.role,
    },
    garden: {
      ...activeWeek.garden,
      stageIndex: growth.stageIndex,
      label: growth.stage.label,
      percentToNext: growth.percentToNext,
      nextLabel: growth.nextStage?.label ?? null,
      todayCompleted,
      todayTotal: participantRows.length,
    },
    weeks,
    activeWeekNumber,
    campaign: {
      id: campaign.id,
      title: campaign.title,
      startDate: campaign.startDate,
      endDate: campaign.endDate,
      timezone: campaign.timezone,
      retentionDeleteAt: campaign.retentionDeleteAt,
      phase,
      writable: phase === "active",
    },
    viewer,
    serverNow: now.toISOString(),
    todayDate: today,
    pollAfterMs: POLL_AFTER_MS,
    summary: {
      today: {
        dayId: todayDay?.id ?? null,
        date: todayDay?.date ?? today,
        completed: todayCompleted,
        total: participantRows.length,
      },
      week: {
        completed: activeWeek.garden.completedCount,
        total: GARDEN_COMPLETION_GOAL,
      },
      growth: {
        stageIndex: growth.stageIndex,
        stage: growth.stage,
        nextStage: growth.nextStage,
        remaining: growth.remaining,
        percentToNext: growth.percentToNext,
      },
    },
    days: dayRows.map((day) => {
      const weekNumber = day.dayOrder <= 7 ? 1 : 2;
      const variants = serializedVariants.filter(
        (variant) => variant.dayId === day.id,
      );
      const viewerCompleted =
        viewer.role === "member" &&
        completedSet.has(`${viewer.participantId}:${day.id}`);
      const isFuture = day.date > today;
      const writable = phase === "active" && !isFuture;
      return {
        id: day.id,
        date: day.date,
        order: day.dayOrder,
        dayOrder: day.dayOrder,
        weekNumber,
        weekDayOrder: ((day.dayOrder - 1) % 7) + 1,
        title: day.title,
        passage: day.passageReference,
        passageReference: day.passageReference,
        sourceUrl: day.sourceUrl,
        isToday: day.date === today,
        isPast: day.date < today,
        isFuture,
        canComplete: writable,
        writable,
        viewerCompleted,
        variants,
      };
    }),
    participants: orderedParticipants.map((participant) => ({
      id: participant.id,
      name:
        viewer.role === "admin" ||
        participant.id === viewer.participantId ||
        participant.consentedAt
          ? participant.name
          : `참여자 ${participant.sortOrder}`,
      sortOrder: participant.sortOrder,
      isMe:
        viewer.role === "member" && participant.id === viewer.participantId,
      todayCompleted: todayDay
        ? completedSet.has(`${participant.id}:${todayDay.id}`)
        : false,
      days: dayRows.map((day) => ({
        dayId: day.id,
        completed: completedSet.has(`${participant.id}:${day.id}`),
      })),
      completions: Object.fromEntries(
        dayRows.map((day) => [
          day.id,
          completedSet.has(`${participant.id}:${day.id}`),
        ]),
      ),
    })),
    completions: completedRows.map((row) => ({
      participantId: row.participantId,
      dayId: row.dayId,
      completedAt: row.completedAt,
    })),
    contentVariants: serializedVariants,
  };
}

type ContentRow = typeof contentVariants.$inferSelect;

function serializeVariant(variant: ContentRow, today: string) {
  let body: unknown = null;
  if (variant.mode === "embedded" && variant.bodyJson) {
    try {
      body = JSON.parse(variant.bodyJson) as unknown;
    } catch {
      body = null;
    }
  }
  const bodyRecord = toRecord(body);
  const rights = toRecord(bodyRecord.rights);
  const rightsBasis =
    rights.basis === "public_domain" || rights.basis === "owned"
      ? rights.basis
      : "licensed";
  const perpetual = rightsBasis === "public_domain" || rightsBasis === "owned";
  const rightsValid =
    variant.rightsConfirmed &&
    (perpetual || Boolean(variant.rightsExpiresAt && variant.rightsExpiresAt >= today));
  const embedded = variant.mode === "embedded" && rightsValid && body !== null;

  return {
    id: variant.id,
    dayId: variant.dayId,
    kind: variant.kind,
    key: variant.variantKey,
    label: variant.label,
    mode: embedded ? "embedded" : "external",
    sourceName: variant.sourceName,
    sourceUrl: variant.sourceUrl,
    translationKey: variant.translationKey,
    commentaryKey: variant.commentaryKey,
    body: embedded ? body : null,
    rightsBasis: embedded ? rightsBasis : null,
    rightsNotice:
      embedded && typeof rights.notice === "string" ? rights.notice : null,
    rightsUrl:
      embedded && typeof rights.url === "string" ? rights.url : null,
    rightsExpiresAt: embedded ? variant.rightsExpiresAt : null,
    copyAllowed:
      embedded && variant.kind === "bible" && variant.copyAllowed,
    maxCopyVerses:
      embedded && variant.kind === "bible" && variant.copyAllowed
        ? variant.maxCopyVerses
        : 0,
    notice: embedded
      ? null
      : "저작권 이용 허가 전에는 공식 원문 링크로 연결됩니다.",
  };
}

function toRecord(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};
}
