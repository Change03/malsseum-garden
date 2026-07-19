import {
  GARDEN_COMPLETION_GOAL,
  getGrowthProgress,
  MAX_COMPLETION_COUNT,
} from "../../lib/domain/growth";

export type Campaign = {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  timeZone: string;
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "participant";
};

export type CampaignDay = {
  id: string;
  date: string;
  title: string;
  passage: string;
  officialUrl: string;
  order: number;
  weekNumber: number;
  weekDayOrder: number;
  isToday: boolean;
  isPast: boolean;
  isFuture: boolean;
  canComplete: boolean;
  writable: boolean;
};

export type Participant = {
  id: string;
  name: string;
  role: "admin" | "participant";
  inviteStatus: string;
};

export type Completion = {
  participantId: string;
  dayId: string;
  completed: boolean;
  completedAt: string | null;
};

export type Garden = {
  weekNumber: number;
  stage: number;
  completedCount: number;
  totalCount: number;
  possibleCount: number;
  progress: number;
  percentToNext: number;
  remaining: number;
  nextLabel: string | null;
};

export type CampaignWeek = {
  number: number;
  label: string;
  startDate: string;
  endDate: string;
  dayIds: string[];
  garden: Garden;
};

export type ContentVariant = {
  id: string;
  dayId: string | null;
  variantKey?: string;
  label: string;
  description: string;
  externalUrl: string;
  sourceName?: string;
  kind: string;
  category: "scripture" | "commentary";
  mode: "embedded" | "external";
  heading?: string;
  verses: {
    number: string;
    reference?: string;
    text: string;
    sourceUrl?: string;
  }[];
  paragraphs: string[];
  copyAllowed: boolean;
  maxCopyVerses: number;
  rightsBasis?: "public_domain" | "owned" | "licensed" | null;
  rightsNotice?: string | null;
  rightsUrl?: string | null;
  rightsExpiresAt: string | null;
};

export type CampaignPhase = {
  name: string;
  currentDayId: string | null;
  message: string;
};

export type WeekData = {
  campaign: Campaign;
  currentUser: CurrentUser;
  days: CampaignDay[];
  participants: Participant[];
  completions: Completion[];
  garden: Garden;
  weeks: CampaignWeek[];
  activeWeekNumber: number;
  phase: CampaignPhase;
  contentVariants: ContentVariant[];
};

const readingFallback: Record<string, string> = {
  "2026-07-27": "이사야 9:8–10:4",
  "2026-07-28": "이사야 10:5–19",
  "2026-07-29": "이사야 10:20–34",
  "2026-07-30": "이사야 11:1–16",
  "2026-07-31": "이사야 12:1–6",
  "2026-08-01": "이사야 13:1–22",
  "2026-08-02": "이사야 14:1–23",
  "2026-08-03": "이사야 14:24–15:9",
  "2026-08-04": "이사야 16:1–14",
  "2026-08-05": "이사야 17:1–14",
  "2026-08-06": "이사야 18:1–19:15",
  "2026-08-07": "이사야 19:16–20:6",
  "2026-08-08": "이사야 21:1–17",
  "2026-08-09": "이사야 22:1–25",
};

const dateFallback = Object.keys(readingFallback);

export function normalizeWeek(input: unknown): WeekData {
  const root = record(input);
  const campaignRaw = record(root.campaign);
  const currentUserRaw = record(root.currentUser ?? root.user);
  const phaseRaw = root.phase ?? campaignRaw.phase;
  const phaseRecord = record(phaseRaw);
  const phaseName = typeof phaseRaw === "string"
    ? phaseRaw
    : text(phaseRecord, ["name", "status", "phase"], "active");
  const dayItems = array(root.days);
  const participantItems = array(root.participants ?? root.members);

  const days = (dayItems.length ? dayItems : dateFallback).map((item, index) => {
    const raw = typeof item === "string" ? { date: item } : record(item);
    const date = text(raw, ["date", "readingDate", "dayDate"], dateFallback[index] ?? "");
    const isFuture = boolean(raw, ["isFuture"], Boolean(date && date > seoulDateKey()));
    const isToday = boolean(raw, ["isToday"], date === seoulDateKey());
    const isPast = boolean(raw, ["isPast"], Boolean(date && date < seoulDateKey()));
    const writable = boolean(raw, ["writable", "canComplete"], phaseName === "active" && !isFuture);
    return {
      id: text(raw, ["id", "dayId", "day_id"], date || String(index + 1)),
      date,
      title: text(raw, ["title", "name", "subject", "qtTitle"], "오늘의 말씀"),
      passage: text(
        raw,
        ["passage", "reference", "passageReference", "bibleReference", "reading"],
        readingFallback[date] ?? "본문 준비 중",
      ),
      officialUrl: safeUrl(
        text(raw, ["officialUrl", "externalUrl", "sourceUrl", "url"], ""),
        "https://sum.su.or.kr:8888/bible/today",
      ),
      order: number(raw, ["order", "dayNumber", "sequence"], index + 1),
      weekNumber: number(raw, ["weekNumber", "week", "week_number"], Math.floor(index / 7) + 1),
      weekDayOrder: number(raw, ["weekDayOrder", "week_day_order"], (index % 7) + 1),
      isToday,
      isPast,
      isFuture,
      canComplete: boolean(raw, ["canComplete", "writable"], writable),
      writable,
    } satisfies CampaignDay;
  });

  days.sort((a, b) => a.order - b.order || a.date.localeCompare(b.date));

  const participants = participantItems.map((item, index) => {
    const raw = record(item);
    const role = text(raw, ["role"], "participant") === "admin" ? "admin" : "participant";
    return {
      id: text(raw, ["id", "participantId", "participant_id", "memberId"], String(index + 1)),
      name: text(raw, ["name", "displayName", "participantName"], `참여자 ${index + 1}`),
      role,
      inviteStatus: text(raw, ["inviteStatus", "invitationStatus", "status"], "joined"),
    } satisfies Participant;
  });

  const currentRole = text(currentUserRaw, ["role"], "participant") === "admin" ? "admin" : "participant";
  const currentUser: CurrentUser = {
    id: text(currentUserRaw, ["id", "participantId", "participant_id", "memberId"], "me"),
    name: text(currentUserRaw, ["name", "displayName", "fullName"], "나"),
    email: text(currentUserRaw, ["email"], ""),
    role: currentRole,
  };

  const completions = normalizeCompletions(root.completions, participants, days);
  const weekItems = array(root.weeks);
  let weeks = [1, 2].map((weekNumber, index) => {
    const weekRaw = record(
      weekItems.find((item) =>
        number(record(item), ["number", "weekNumber", "week_number"], -1) === weekNumber,
      ) ?? weekItems[index],
    );
    const weekDays = days.filter((day) => day.weekNumber === weekNumber);
    const dayIds = weekDays.map((day) => day.id);
    const completedCount = countCompletedForDays(completions, dayIds);
    return {
      number: weekNumber,
      label: text(weekRaw, ["label", "name"], `${weekNumber}주차 정원`),
      startDate: text(weekRaw, ["startDate", "start_date"], weekDays[0]?.date ?? ""),
      endDate: text(weekRaw, ["endDate", "end_date"], weekDays.at(-1)?.date ?? ""),
      dayIds,
      garden: normalizeGarden(
        record(weekRaw.garden),
        completedCount,
        weekNumber,
        Math.max(1, participants.length * dayIds.length),
      ),
    } satisfies CampaignWeek;
  });
  const activeWeekNumber = Math.max(
    1,
    Math.min(
      2,
      Math.round(
        number(
          root,
          ["activeWeekNumber", "active_week_number"],
          seoulDateKey() < "2026-08-03" ? 1 : 2,
        ),
      ),
    ),
  );
  const gardenRaw = record(root.garden);
  if (Object.keys(gardenRaw).length) {
    weeks = weeks.map((week) => week.number === activeWeekNumber
      ? {
          ...week,
          garden: normalizeGarden(
            gardenRaw,
            countCompletedForDays(completions, week.dayIds),
            week.number,
            Math.max(1, participants.length * week.dayIds.length),
          ),
        }
      : week);
  }
  const garden = weeks.find((week) => week.number === activeWeekNumber)?.garden
    ?? weeks[0].garden;

  return {
    campaign: {
      id: text(campaignRaw, ["id", "campaignId"], "two-week-qt"),
      title: text(campaignRaw, ["title", "name"], "말씀정원"),
      startDate: text(campaignRaw, ["startDate", "startsAt", "start_date"], days[0]?.date ?? "2026-07-27"),
      endDate: text(campaignRaw, ["endDate", "endsAt", "end_date"], days.at(-1)?.date ?? "2026-08-09"),
      timeZone: text(campaignRaw, ["timeZone", "timezone"], "Asia/Seoul"),
    },
    currentUser,
    days,
    participants,
    completions,
    garden,
    weeks,
    activeWeekNumber,
    phase: {
      name: phaseName,
      currentDayId: nullableText(phaseRecord, ["currentDayId", "dayId", "current_day_id"]),
      message: text(phaseRecord, ["message", "label"], ""),
    },
    contentVariants: array(root.contentVariants ?? root.variants).map((item, index) => {
      const raw = record(item);
      const label = text(raw, ["label", "name", "title", "translationLabel", "editionLabel"], `공식 콘텐츠 ${index + 1}`);
      const kind = text(raw, ["kind", "type", "variantType", "contentType"], "external");
      const mode = text(raw, ["mode", "displayMode"], kind === "embedded" ? "embedded" : "external") === "embedded"
        ? "embedded"
        : "external";
      const body = record(raw.body);
      const externalUrl = safeUrl(
        text(raw, ["externalUrl", "officialUrl", "sourceUrl", "url"], ""),
        "https://sum.su.or.kr:8888/bible/today",
      );
      const rawRightsBasis = nullableText(raw, ["rightsBasis", "rights_basis"]);
      return {
        id: text(raw, ["id", "variantId", "key"], `variant-${index + 1}`),
        dayId: nullableText(raw, ["dayId", "day_id"]),
        variantKey: text(raw, ["key", "variantKey", "variant_key"], ""),
        label,
        description: text(raw, ["description", "summary", "note"], "공식 제공 페이지에서 읽어요."),
        externalUrl,
        sourceName: text(raw, ["sourceName", "source_name"], ""),
        kind,
        category: contentCategory(raw, label, kind),
        mode,
        heading: text(body, ["heading", "title"], ""),
        verses: array(body.verses ?? raw.verses).map((verse, verseIndex) => {
          const verseRaw = record(verse);
          return {
            number: text(verseRaw, ["number", "verse", "verseNumber"], String(verseIndex + 1)),
            reference: text(verseRaw, ["reference", "passage"], ""),
            text: text(verseRaw, ["text", "content", "body"], ""),
            sourceUrl: safeUrl(
              text(verseRaw, ["sourceUrl", "source_url", "url"], externalUrl),
              externalUrl,
            ),
          };
        }).filter((verse) => verse.text),
        paragraphs: array(body.paragraphs ?? raw.paragraphs).filter((paragraph): paragraph is string => typeof paragraph === "string" && Boolean(paragraph.trim())),
        copyAllowed: truthy(raw.copyAllowed),
        maxCopyVerses: Math.max(0, number(raw, ["maxCopyVerses"], 0)),
        rightsBasis:
          rawRightsBasis === "public_domain" || rawRightsBasis === "owned" || rawRightsBasis === "licensed"
            ? rawRightsBasis
            : null,
        rightsNotice: nullableText(raw, ["rightsNotice", "rights_notice"]),
        rightsUrl: nullableText(raw, ["rightsUrl", "rights_url"]),
        rightsExpiresAt: nullableText(raw, ["rightsExpiresAt", "rights_expires_at"]),
      } satisfies ContentVariant;
    }),
  };
}

export function completionFor(data: WeekData, participantId: string, dayId: string): boolean {
  return Boolean(
    data.completions.find(
      (item) => item.participantId === participantId && item.dayId === dayId && item.completed,
    ),
  );
}

export function daysForWeek(data: WeekData, weekNumber: number): CampaignDay[] {
  return data.days.filter((day) => day.weekNumber === weekNumber);
}

export function gardenForWeek(data: WeekData, weekNumber: number): Garden {
  return data.weeks.find((week) => week.number === weekNumber)?.garden
    ?? data.garden;
}

export function weekForDay(
  data: WeekData,
  day: CampaignDay | undefined,
): CampaignWeek {
  return data.weeks.find((week) => week.number === day?.weekNumber)
    ?? data.weeks.find((week) => week.number === data.activeWeekNumber)
    ?? data.weeks[0];
}

export function withCompletion(
  data: WeekData,
  participantId: string,
  dayId: string,
  completed: boolean,
): WeekData {
  const existing = data.completions.findIndex(
    (item) => item.participantId === participantId && item.dayId === dayId,
  );
  const next = [...data.completions];
  const recordValue: Completion = {
    participantId,
    dayId,
    completed,
    completedAt: completed ? new Date().toISOString() : null,
  };
  if (existing >= 0) next[existing] = recordValue;
  else next.push(recordValue);
  const weeks = data.weeks.map((week) => ({
    ...week,
    garden: normalizeGarden(
      {},
      countCompletedForDays(next, week.dayIds),
      week.number,
      Math.max(1, data.participants.length * week.dayIds.length),
    ),
  }));
  const garden = weeks.find((week) => week.number === data.activeWeekNumber)?.garden
    ?? weeks[0].garden;
  return {
    ...data,
    completions: next,
    weeks,
    garden,
  };
}

export function focusDay(data: WeekData): CampaignDay | undefined {
  if (data.phase.currentDayId) {
    const phaseDay = data.days.find((day) => day.id === data.phase.currentDayId);
    if (phaseDay) return phaseDay;
  }
  const serverToday = data.days.find((day) => day.isToday);
  if (serverToday) return serverToday;
  const today = seoulDateKey();
  const calendarDay = data.days.find((day) => day.date === today);
  if (calendarDay) return calendarDay;
  const firstUnread = data.days.find(
    (day) => !completionFor(data, data.currentUser.id, day.id),
  );
  return firstUnread ?? data.days.at(-1);
}

export function seoulDateKey(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Seoul",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function isFutureDay(date: string): boolean {
  return Boolean(date && date > seoulDateKey());
}

export function formatDay(date: string, options?: Intl.DateTimeFormatOptions): string {
  if (!date) return "날짜 미정";
  const value = new Date(`${date}T12:00:00+09:00`);
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    weekday: "short",
    ...options,
  }).format(value);
}

export function variantsForDay(data: WeekData, day: CampaignDay): ContentVariant[] {
  const selected = data.contentVariants.filter((variant) => !variant.dayId || variant.dayId === day.id);
  if (selected.length) return selected;
  return [
    {
      id: "daily-bible",
      dayId: day.id,
      label: "매일성경",
      description: "오늘의 본문과 성서유니온 해설",
      externalUrl: day.officialUrl,
      kind: "external",
      category: "commentary",
      mode: "external",
      verses: [],
      paragraphs: [],
      copyAllowed: false,
      maxCopyVerses: 0,
      rightsExpiresAt: null,
    },
    {
      id: "daily-bible-simple",
      dayId: day.id,
      label: "매일성경 순",
      description: "더 간결한 흐름으로 묵상하는 판본",
      externalUrl: day.officialUrl,
      kind: "external",
      category: "commentary",
      mode: "external",
      verses: [],
      paragraphs: [],
      copyAllowed: false,
      maxCopyVerses: 0,
      rightsExpiresAt: null,
    },
    {
      id: "easy-bible",
      dayId: day.id,
      label: "쉬운성경",
      description: "쉬운 문장으로 본문을 읽는 선택",
      externalUrl: day.officialUrl,
      kind: "external",
      category: "scripture",
      mode: "external",
      verses: [],
      paragraphs: [],
      copyAllowed: false,
      maxCopyVerses: 0,
      rightsExpiresAt: null,
    },
    {
      id: "new-korean-bible",
      dayId: day.id,
      label: "새번역",
      description: "새번역으로 오늘의 본문을 읽어요.",
      externalUrl: day.officialUrl,
      kind: "external",
      category: "scripture",
      mode: "external",
      verses: [],
      paragraphs: [],
      copyAllowed: false,
      maxCopyVerses: 0,
      rightsExpiresAt: null,
    },
    {
      id: "revised-korean-bible",
      dayId: day.id,
      label: "개역개정",
      description: "개역개정으로 오늘의 본문을 읽어요.",
      externalUrl: day.officialUrl,
      kind: "external",
      category: "scripture",
      mode: "external",
      verses: [],
      paragraphs: [],
      copyAllowed: false,
      maxCopyVerses: 0,
      rightsExpiresAt: null,
    },
  ];
}

function contentCategory(
  raw: Record<string, unknown>,
  label: string,
  kind: string,
): "scripture" | "commentary" {
  const explicit = text(raw, ["category", "axis", "contentCategory"], "").toLowerCase();
  if (["commentary", "edition", "explanation", "해설"].includes(explicit)) return "commentary";
  if (["scripture", "translation", "bible", "본문"].includes(explicit)) return "scripture";
  const hint = `${label} ${kind}`.toLowerCase();
  if (/해설|commentary|edition|매일성경/.test(hint)) return "commentary";
  return "scripture";
}

function normalizeCompletions(
  input: unknown,
  participants: Participant[],
  days: CampaignDay[],
): Completion[] {
  const result: Completion[] = [];
  const participantIds = new Set(participants.map((item) => item.id));
  const dayIds = new Set(days.map((item) => item.id));
  const push = (participantId: string, dayId: string, value: unknown, completedAt: unknown = null) => {
    if (!participantId || !dayId) return;
    const raw = record(value);
    const hasCompletionFlag = "completed" in raw || "isCompleted" in raw || "done" in raw;
    const completed = typeof value === "boolean"
      ? value
      : hasCompletionFlag
        ? truthy(raw.completed ?? raw.isCompleted ?? raw.done)
        : true;
    result.push({
      participantId,
      dayId,
      completed,
      completedAt: typeof completedAt === "string"
        ? completedAt
        : nullableText(raw, ["completedAt", "completed_at", "updatedAt"]),
    });
  };

  if (Array.isArray(input)) {
    input.forEach((item) => {
      const raw = record(item);
      push(
        text(raw, ["participantId", "participant_id", "memberId", "userId"], ""),
        text(raw, ["dayId", "day_id", "campaignDayId"], ""),
        raw,
        raw.completedAt ?? raw.completed_at,
      );
    });
    return dedupeCompletions(result);
  }

  const map = record(input);
  Object.entries(map).forEach(([outerKey, outerValue]) => {
    if (typeof outerValue === "boolean") {
      const [participantId, dayId] = outerKey.split(/[:|/]/);
      push(participantId, dayId, outerValue);
      return;
    }
    const innerMap = record(outerValue);
    Object.entries(innerMap).forEach(([innerKey, innerValue]) => {
      if (participantIds.has(outerKey) || !dayIds.has(outerKey)) push(outerKey, innerKey, innerValue);
      else push(innerKey, outerKey, innerValue);
    });
  });
  return dedupeCompletions(result);
}

function dedupeCompletions(items: Completion[]): Completion[] {
  const map = new Map<string, Completion>();
  items.forEach((item) => map.set(`${item.participantId}:${item.dayId}`, item));
  return [...map.values()];
}

function record(value: unknown): Record<string, unknown> {
  return value && typeof value === "object" && !Array.isArray(value)
    ? value as Record<string, unknown>
    : {};
}

function array(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function text(source: Record<string, unknown>, keys: string[], fallback: string): string {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "string" && value.trim()) return value.trim();
    if (typeof value === "number") return String(value);
  }
  return fallback;
}

function nullableText(source: Record<string, unknown>, keys: string[]): string | null {
  const value = text(source, keys, "");
  return value || null;
}

function number(source: Record<string, unknown>, keys: string[], fallback: number): number {
  for (const key of keys) {
    const value = source[key];
    if (typeof value === "number" && Number.isFinite(value)) return value;
    if (typeof value === "string" && value.trim() && Number.isFinite(Number(value))) return Number(value);
  }
  return fallback;
}

function boolean(source: Record<string, unknown>, keys: string[], fallback: boolean): boolean {
  for (const key of keys) {
    if (key in source) return truthy(source[key]);
  }
  return fallback;
}

function countCompletedForDays(
  completions: Completion[],
  dayIds: string[],
): number {
  const selected = new Set(dayIds);
  return completions.filter(
    (completion) => completion.completed && selected.has(completion.dayId),
  ).length;
}

function normalizeGarden(
  raw: Record<string, unknown>,
  fallbackCount: number,
  weekNumber: number,
  possibleCount: number,
): Garden {
  const completedCount = Math.max(
    0,
    Math.min(
      MAX_COMPLETION_COUNT,
      Math.round(number(raw, ["completedCount", "count", "completed"], fallbackCount)),
    ),
  );
  const growth = getGrowthProgress(completedCount);
  const suppliedProgress = number(raw, ["progress", "progressRatio", "percentage"], -1);
  return {
    weekNumber,
    stage: Math.max(
      0,
      Math.min(
        8,
        Math.round(number(raw, ["stageIndex", "stage", "level"], growth.stageIndex)),
      ),
    ),
    completedCount,
    totalCount: Math.max(
      1,
      Math.round(number(raw, ["totalCount", "target", "total"], GARDEN_COMPLETION_GOAL)),
    ),
    possibleCount: Math.max(
      1,
      Math.round(number(raw, ["possibleCount", "possible_count"], possibleCount)),
    ),
    progress: suppliedProgress >= 0
      ? Math.min(1, suppliedProgress > 1 ? suppliedProgress / 100 : suppliedProgress)
      : Math.min(1, completedCount / GARDEN_COMPLETION_GOAL),
    percentToNext: Math.max(
      0,
      Math.min(100, Math.round(number(raw, ["percentToNext"], growth.percentToNext))),
    ),
    remaining: Math.max(
      0,
      Math.round(number(raw, ["remaining"], growth.remaining)),
    ),
    nextLabel: nullableText(raw, ["nextLabel"]) ?? growth.nextStage?.label ?? null,
  };
}

function truthy(value: unknown): boolean {
  return value === true || value === 1 || value === "1" || value === "true" || value === "Y";
}

function safeUrl(value: string, fallback: string): string {
  try {
    const url = new URL(value || fallback);
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : fallback;
  } catch {
    return fallback;
  }
}
