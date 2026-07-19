import { describe, expect, it } from "vitest";
import {
  daysForWeek,
  gardenForWeek,
  normalizeWeek,
  withCompletion,
} from "../../app/components/model";

const dates = [
  "2026-07-27",
  "2026-07-28",
  "2026-07-29",
  "2026-07-30",
  "2026-07-31",
  "2026-08-01",
  "2026-08-02",
  "2026-08-03",
  "2026-08-04",
  "2026-08-05",
  "2026-08-06",
  "2026-08-07",
  "2026-08-08",
  "2026-08-09",
];

function payload(completions: unknown[] = []) {
  return {
    campaign: {
      id: "word-garden-2026-07",
      title: "말씀정원",
      startDate: dates[0],
      endDate: dates.at(-1),
      timezone: "Asia/Seoul",
    },
    currentUser: { id: "p01", name: "참여자 1", role: "member" },
    phase: "active",
    activeWeekNumber: 1,
    days: dates.map((date, index) => ({
      id: `d${index + 1}`,
      date,
      order: index + 1,
      weekNumber: Math.floor(index / 7) + 1,
      weekDayOrder: (index % 7) + 1,
      passage: `이사야 ${index + 1}:1`,
      title: "오늘의 말씀",
      canComplete: true,
      writable: true,
    })),
    participants: Array.from({ length: 13 }, (_, index) => ({
      id: `p${String(index + 1).padStart(2, "0")}`,
      name: `참여자 ${index + 1}`,
    })),
    completions,
    weeks: [
      {
        number: 1,
        label: "1주차 정원",
        startDate: dates[0],
        endDate: dates[6],
        dayIds: dates.slice(0, 7).map((_, index) => `d${index + 1}`),
      },
      {
        number: 2,
        label: "2주차 정원",
        startDate: dates[7],
        endDate: dates[13],
        dayIds: dates.slice(7).map((_, index) => `d${index + 8}`),
      },
    ],
  };
}

describe("two-week client model", () => {
  it("splits fourteen days into two seven-day gardens", () => {
    const data = normalizeWeek(payload());

    expect(data.days).toHaveLength(14);
    expect(data.weeks).toHaveLength(2);
    expect(daysForWeek(data, 1)).toHaveLength(7);
    expect(daysForWeek(data, 2)).toHaveLength(7);
    expect(gardenForWeek(data, 1).totalCount).toBe(56);
    expect(gardenForWeek(data, 2).completedCount).toBe(0);
  });

  it("updates only the garden that owns the changed day", () => {
    const initial = normalizeWeek(payload());
    const weekOneChecked = withCompletion(initial, "p01", "d1", true);
    const bothWeeksChecked = withCompletion(weekOneChecked, "p01", "d8", true);

    expect(gardenForWeek(weekOneChecked, 1).completedCount).toBe(1);
    expect(gardenForWeek(weekOneChecked, 2).completedCount).toBe(0);
    expect(gardenForWeek(bothWeeksChecked, 1).completedCount).toBe(1);
    expect(gardenForWeek(bothWeeksChecked, 2).completedCount).toBe(1);
  });

  it("finishes week one at 56 checks while week two remains a seed", () => {
    const completions = Array.from({ length: 8 }, (_, participantIndex) =>
      Array.from({ length: 7 }, (_, dayIndex) => ({
        participantId: `p${String(participantIndex + 1).padStart(2, "0")}`,
        dayId: `d${dayIndex + 1}`,
        completed: true,
      })),
    ).flat();
    const data = normalizeWeek(payload(completions));

    expect(gardenForWeek(data, 1)).toMatchObject({
      completedCount: 56,
      stage: 8,
      remaining: 0,
    });
    expect(gardenForWeek(data, 2)).toMatchObject({
      completedCount: 0,
      stage: 0,
    });
  });
});
