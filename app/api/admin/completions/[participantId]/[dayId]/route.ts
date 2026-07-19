import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import {
  auditLogs,
  completions,
  devotionalDays,
  participants,
} from "@/db/schema";
import { getCompletionEligibility } from "@/lib/domain/campaign-clock";
import { requireAdmin } from "@/lib/server/auth";
import { CAMPAIGN_ID, POLL_AFTER_MS } from "@/lib/server/constants";
import { randomId } from "@/lib/server/crypto";
import {
  ApiError,
  errorResponse,
  isSameOriginMutation,
  json,
  readJson,
} from "@/lib/server/response";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  {
    params,
  }: { params: Promise<{ participantId: string; dayId: string }> },
) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    await requireAdmin(request);
    const payload = await readJson(request);
    if (!isAdminCompletionPayload(payload)) {
      throw new ApiError(400, "INVALID_COMPLETION", "정정 값을 확인해 주세요.");
    }
    const { participantId, dayId } = await params;
    const db = getDb();
    const [[participant], [day], [before]] = await Promise.all([
      db
        .select({ id: participants.id })
        .from(participants)
        .where(
          and(
            eq(participants.id, participantId),
            eq(participants.campaignId, CAMPAIGN_ID),
            eq(participants.active, true),
          ),
        )
        .limit(1),
      db
        .select({ id: devotionalDays.id, date: devotionalDays.date })
        .from(devotionalDays)
        .where(
          and(
            eq(devotionalDays.id, dayId),
            eq(devotionalDays.campaignId, CAMPAIGN_ID),
          ),
        )
        .limit(1),
      db
        .select({
          completed: completions.completed,
          completedAt: completions.completedAt,
        })
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
            eq(completions.participantId, participantId),
            eq(completions.dayId, dayId),
            eq(participants.campaignId, CAMPAIGN_ID),
            eq(devotionalDays.campaignId, CAMPAIGN_ID),
          ),
        )
        .limit(1),
    ]);

    if (!participant) {
      throw new ApiError(
        404,
        "PARTICIPANT_NOT_FOUND",
        "참여자를 찾을 수 없습니다.",
      );
    }
    if (!day) {
      throw new ApiError(404, "DAY_NOT_FOUND", "묵상 날짜를 찾을 수 없습니다.");
    }
    const eligibility = getCompletionEligibility(day.date);
    if (!eligibility.allowed) {
      throw new ApiError(423, "DAY_LOCKED", "현재는 읽음 기록을 정정할 수 없습니다.");
    }

    const now = new Date().toISOString();
    const mutation = db
      .insert(completions)
      .values({
        participantId,
        dayId,
        completed: payload.completed,
        completedAt: payload.completed ? now : null,
        updatedAt: now,
        updatedByRole: "admin",
        updatedById: "admin",
      })
      .onConflictDoUpdate({
        target: [completions.participantId, completions.dayId],
        set: {
          completed: payload.completed,
          completedAt: payload.completed ? now : null,
          updatedAt: now,
          updatedByRole: "admin",
          updatedById: "admin",
        },
      });
    const audit = db.insert(auditLogs).values({
      id: randomId(),
      campaignId: CAMPAIGN_ID,
      actorRole: "admin",
      actorId: "admin",
      action: "completion.corrected",
      targetType: "completion",
      targetId: `${participantId}:${dayId}`,
      beforeJson: JSON.stringify(before ?? { completed: false, completedAt: null }),
      afterJson: JSON.stringify({
        completed: payload.completed,
        completedAt: payload.completed ? now : null,
        reason: payload.reason?.trim() || null,
      }),
    });

    await db.batch([mutation, audit]);

    return json({
      completion: {
        participantId,
        dayId,
        completed: payload.completed,
        completedAt: payload.completed ? now : null,
        correctedBy: "admin",
      },
      pollAfterMs: POLL_AFTER_MS,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

function isAdminCompletionPayload(
  value: unknown,
): value is { completed: boolean; reason?: string } {
  if (typeof value !== "object" || value === null || !("completed" in value)) {
    return false;
  }
  if (typeof value.completed !== "boolean") return false;
  if (
    "reason" in value &&
    (typeof value.reason !== "string" || value.reason.length > 300)
  ) {
    return false;
  }
  return true;
}
