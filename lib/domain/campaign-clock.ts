export const KST_TIME_ZONE = "Asia/Seoul";

export interface CampaignSchedule {
  startDate: string;
  endDate: string;
  purgeDate: string;
}

export const WORD_GARDEN_CAMPAIGN = {
  startDate: "2026-07-27",
  endDate: "2026-08-09",
  purgeDate: "2026-09-09",
} as const satisfies CampaignSchedule;

export const WORD_GARDEN_WEEK_TWO_START = "2026-08-03";

export type CampaignPhase = "preview" | "active" | "readOnly" | "purgeDue";

export type CompletionEligibilityReason =
  | "available"
  | "outsideCampaign"
  | "campaignNotStarted"
  | "campaignClosed"
  | "futureDay";

export interface CompletionEligibility {
  allowed: boolean;
  reason: CompletionEligibilityReason;
}

const DATE_KEY_PATTERN = /^\d{4}-(0[1-9]|1[0-2])-([0-2]\d|3[01])$/;

const kstDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: KST_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

function assertValidInstant(now: Date) {
  if (!(now instanceof Date) || Number.isNaN(now.getTime())) {
    throw new TypeError("now must be a valid Date.");
  }
}

function assertValidDateKey(dateKey: string, fieldName: string) {
  if (!DATE_KEY_PATTERN.test(dateKey)) {
    throw new TypeError(`${fieldName} must use YYYY-MM-DD format.`);
  }

  const [year, month, day] = dateKey.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));

  if (
    candidate.getUTCFullYear() !== year ||
    candidate.getUTCMonth() !== month - 1 ||
    candidate.getUTCDate() !== day
  ) {
    throw new TypeError(`${fieldName} must be a real calendar date.`);
  }
}

function assertValidSchedule(schedule: CampaignSchedule) {
  assertValidDateKey(schedule.startDate, "startDate");
  assertValidDateKey(schedule.endDate, "endDate");
  assertValidDateKey(schedule.purgeDate, "purgeDate");

  if (
    schedule.startDate > schedule.endDate ||
    schedule.endDate >= schedule.purgeDate
  ) {
    throw new RangeError(
      "Campaign dates must satisfy startDate <= endDate < purgeDate.",
    );
  }
}

export function getKstDateKey(now: Date = new Date()): string {
  assertValidInstant(now);

  const parts = kstDateFormatter.formatToParts(now);
  const year = parts.find(({ type }) => type === "year")?.value;
  const month = parts.find(({ type }) => type === "month")?.value;
  const day = parts.find(({ type }) => type === "day")?.value;

  if (!year || !month || !day) {
    throw new RangeError("Unable to determine the current KST date.");
  }

  return `${year}-${month}-${day}`;
}

export function getCampaignPhase(
  now: Date = new Date(),
  schedule: CampaignSchedule = WORD_GARDEN_CAMPAIGN,
): CampaignPhase {
  assertValidSchedule(schedule);
  const today = getKstDateKey(now);

  if (today < schedule.startDate) {
    return "preview";
  }

  if (today <= schedule.endDate) {
    return "active";
  }

  if (today < schedule.purgeDate) {
    return "readOnly";
  }

  return "purgeDue";
}

export function getCampaignWeekNumber(now: Date = new Date()): 1 | 2 {
  return getKstDateKey(now) < WORD_GARDEN_WEEK_TWO_START ? 1 : 2;
}

export function getCompletionEligibility(
  dayDate: string,
  now: Date = new Date(),
  schedule: CampaignSchedule = WORD_GARDEN_CAMPAIGN,
): CompletionEligibility {
  assertValidDateKey(dayDate, "dayDate");
  assertValidSchedule(schedule);

  if (dayDate < schedule.startDate || dayDate > schedule.endDate) {
    return { allowed: false, reason: "outsideCampaign" };
  }

  const phase = getCampaignPhase(now, schedule);

  if (phase === "preview") {
    return { allowed: false, reason: "campaignNotStarted" };
  }

  if (phase !== "active") {
    return { allowed: false, reason: "campaignClosed" };
  }

  if (dayDate > getKstDateKey(now)) {
    return { allowed: false, reason: "futureDay" };
  }

  return { allowed: true, reason: "available" };
}

export function canCompleteDay(
  dayDate: string,
  now: Date = new Date(),
  schedule: CampaignSchedule = WORD_GARDEN_CAMPAIGN,
): boolean {
  return getCompletionEligibility(dayDate, now, schedule).allowed;
}
