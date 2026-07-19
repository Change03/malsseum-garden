import { describe, expect, it } from "vitest";
import {
  canCompleteDay,
  getCampaignPhase,
  getCampaignWeekNumber,
  getCompletionEligibility,
  getKstDateKey,
} from "../../lib/domain/campaign-clock";

describe("getKstDateKey", () => {
  it.each([
    ["2026-07-26T14:59:59.999Z", "2026-07-26"],
    ["2026-07-26T15:00:00.000Z", "2026-07-27"],
    ["2026-08-02T14:59:59.999Z", "2026-08-02"],
    ["2026-08-02T15:00:00.000Z", "2026-08-03"],
  ])("%s의 KST 날짜는 %s다", (instant, expected) => {
    expect(getKstDateKey(new Date(instant))).toBe(expected);
  });

  it("유효하지 않은 시각은 거부한다", () => {
    expect(() => getKstDateKey(new Date("invalid"))).toThrow(TypeError);
  });
});

describe("getCampaignPhase", () => {
  it.each([
    ["2026-07-26T14:59:59.999Z", "preview"],
    ["2026-07-26T15:00:00.000Z", "active"],
    ["2026-08-09T14:59:59.999Z", "active"],
    ["2026-08-09T15:00:00.000Z", "readOnly"],
    ["2026-09-08T14:59:59.999Z", "readOnly"],
    ["2026-09-08T15:00:00.000Z", "purgeDue"],
  ] as const)("%s에서 단계는 %s다", (instant, expected) => {
    expect(getCampaignPhase(new Date(instant))).toBe(expected);
  });
});

describe("getCampaignWeekNumber", () => {
  it.each([
    ["2026-08-02T14:59:59.999Z", 1],
    ["2026-08-02T15:00:00.000Z", 2],
    ["2026-09-08T15:00:00.000Z", 2],
  ] as const)("%s에서 %i주차 정원을 선택한다", (instant, expected) => {
    expect(getCampaignWeekNumber(new Date(instant))).toBe(expected);
  });
});

describe("canCompleteDay", () => {
  it("행사 시작 전에는 체크할 수 없다", () => {
    const now = new Date("2026-07-26T14:59:59.999Z");
    expect(canCompleteDay("2026-07-27", now)).toBe(false);
    expect(getCompletionEligibility("2026-07-27", now).reason).toBe(
      "campaignNotStarted",
    );
  });

  it("행사 시작 순간부터 당일을 체크할 수 있다", () => {
    const now = new Date("2026-07-26T15:00:00.000Z");
    expect(canCompleteDay("2026-07-27", now)).toBe(true);
  });

  it("행사 중에는 오늘과 과거 날짜를 보충 체크할 수 있다", () => {
    const now = new Date("2026-08-02T15:00:00.000Z");
    expect(canCompleteDay("2026-07-27", now)).toBe(true);
    expect(canCompleteDay("2026-08-03", now)).toBe(true);
  });

  it("KST 기준 미래 날짜는 잠근다", () => {
    const now = new Date("2026-08-02T15:00:00.000Z");
    expect(canCompleteDay("2026-08-04", now)).toBe(false);
    expect(getCompletionEligibility("2026-08-04", now).reason).toBe(
      "futureDay",
    );
  });

  it("행사 마지막 날의 마지막 순간까지 체크할 수 있다", () => {
    const now = new Date("2026-08-09T14:59:59.999Z");
    expect(canCompleteDay("2026-08-09", now)).toBe(true);
  });

  it("8월 10일 00:00 KST부터 모든 체크를 잠근다", () => {
    const now = new Date("2026-08-09T15:00:00.000Z");
    expect(canCompleteDay("2026-08-09", now)).toBe(false);
    expect(getCompletionEligibility("2026-08-09", now).reason).toBe(
      "campaignClosed",
    );
  });

  it("캠페인 바깥 날짜는 거부한다", () => {
    const now = new Date("2026-08-03T03:00:00.000Z");
    expect(getCompletionEligibility("2026-07-26", now)).toEqual({
      allowed: false,
      reason: "outsideCampaign",
    });
    expect(getCompletionEligibility("2026-08-10", now)).toEqual({
      allowed: false,
      reason: "outsideCampaign",
    });
  });

  it.each(["2026-02-29", "2026-13-01", "2026-07-1", "not-a-date"])(
    "%s 날짜는 거부한다",
    (dayDate) => {
      expect(() => canCompleteDay(dayDate)).toThrow(TypeError);
    },
  );
});
