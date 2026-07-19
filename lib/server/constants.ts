export const CAMPAIGN_ID = "word-garden-2026-07";
export const CAMPAIGN_TITLE = "말씀정원";
export const CAMPAIGN_START_DATE = "2026-07-27";
export const CAMPAIGN_END_DATE = "2026-08-09";
export const CAMPAIGN_TIMEZONE = "Asia/Seoul";
export const RETENTION_DELETE_AT = "2026-09-09T00:00:00+09:00";
export const SESSION_EXPIRES_AT = "2026-09-08T15:00:00.000Z";
export const SESSION_COOKIE_NAME = "wordgarden_session";
export const MEMBER_COOKIE_NAME = "wordgarden_member";
export const OFFICIAL_SOURCE_NAME = "성서유니온 오늘의 묵상";
export const OFFICIAL_SOURCE_URL = "https://sum.su.or.kr:8888/bible/today";
export const POLL_AFTER_MS = 15_000;

export const DAY_SEEDS = [
  ["d1", "2026-07-27", 1, "이사야 9:8–10:4"],
  ["d2", "2026-07-28", 2, "이사야 10:5–19"],
  ["d3", "2026-07-29", 3, "이사야 10:20–34"],
  ["d4", "2026-07-30", 4, "이사야 11:1–16"],
  ["d5", "2026-07-31", 5, "이사야 12:1–6"],
  ["d6", "2026-08-01", 6, "이사야 13:1–22"],
  ["d7", "2026-08-02", 7, "이사야 14:1–23"],
  ["d8", "2026-08-03", 8, "이사야 14:24–15:9"],
  ["d9", "2026-08-04", 9, "이사야 16:1–14"],
  ["d10", "2026-08-05", 10, "이사야 17:1–14"],
  ["d11", "2026-08-06", 11, "이사야 18:1–19:15"],
  ["d12", "2026-08-07", 12, "이사야 19:16–20:6"],
  ["d13", "2026-08-08", 13, "이사야 21:1–17"],
  ["d14", "2026-08-09", 14, "이사야 22:1–25"],
] as const;

export const CAMPAIGN_WEEKS = [
  {
    number: 1,
    label: "1주차 정원",
    startDate: "2026-07-27",
    endDate: "2026-08-02",
    dayIds: ["d1", "d2", "d3", "d4", "d5", "d6", "d7"],
  },
  {
    number: 2,
    label: "2주차 정원",
    startDate: "2026-08-03",
    endDate: "2026-08-09",
    dayIds: ["d8", "d9", "d10", "d11", "d12", "d13", "d14"],
  },
] as const;

export const EXTERNAL_VARIANT_SEEDS = [
  {
    kind: "bible",
    key: "gae",
    label: "개역개정",
    translationKey: "개역개정",
    commentaryKey: null,
  },
  {
    kind: "bible",
    key: "easy",
    label: "쉬운성경",
    translationKey: "쉬운성경",
    commentaryKey: null,
  },
  {
    kind: "bible",
    key: "new",
    label: "새번역",
    translationKey: "새번역",
    commentaryKey: null,
  },
  {
    kind: "commentary",
    key: "daily",
    label: "매일성경",
    translationKey: null,
    commentaryKey: "매일성경",
  },
  {
    kind: "commentary",
    key: "pure",
    label: "매일성경 순",
    translationKey: "새번역",
    commentaryKey: "매일성경 순",
  },
] as const;
