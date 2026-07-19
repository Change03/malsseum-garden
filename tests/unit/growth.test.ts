import { describe, expect, it } from "vitest";
import {
  GROWTH_STAGES,
  MAX_COMPLETION_COUNT,
  getGrowthProgress,
  getGrowthStage,
} from "../../lib/domain/growth";

const boundaryCases = [
  [0, "seed", "씨앗"],
  [1, "sprout", "작은 새싹"],
  [7, "sprout", "작은 새싹"],
  [8, "stem", "줄기"],
  [15, "stem", "줄기"],
  [16, "leafyPlant", "잎이 난 식물"],
  [23, "leafyPlant", "잎이 난 식물"],
  [24, "youngTree", "어린 나무"],
  [31, "youngTree", "어린 나무"],
  [32, "fullBranches", "풍성한 가지"],
  [39, "fullBranches", "풍성한 가지"],
  [40, "flowerBuds", "꽃봉오리"],
  [47, "flowerBuds", "꽃봉오리"],
  [48, "floweringTree", "꽃이 핀 나무"],
  [55, "floweringTree", "꽃이 핀 나무"],
  [56, "fruitGarden", "열매 맺은 완성 정원"],
  [91, "fruitGarden", "열매 맺은 완성 정원"],
] as const;

describe("getGrowthStage", () => {
  it.each(boundaryCases)(
    "%i회는 %s 단계다",
    (total, expectedId, expectedLabel) => {
      expect(getGrowthStage(total)).toMatchObject({
        id: expectedId,
        label: expectedLabel,
      });
    },
  );

  it.each([-1, 92, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "%s는 허용하지 않는다",
    (total) => {
      expect(() => getGrowthStage(total)).toThrow(RangeError);
    },
  );

  it("9개 성장 단계가 빈틈 없이 0부터 91까지 이어진다", () => {
    expect(GROWTH_STAGES).toHaveLength(9);
    expect(GROWTH_STAGES[0].min).toBe(0);
    expect(GROWTH_STAGES.at(-1)?.max).toBe(MAX_COMPLETION_COUNT);

    for (let index = 1; index < GROWTH_STAGES.length; index += 1) {
      expect(GROWTH_STAGES[index].min).toBe(
        GROWTH_STAGES[index - 1].max + 1,
      );
    }
  });
});

describe("getGrowthProgress", () => {
  it("다음 단계까지 남은 횟수와 진행률을 계산한다", () => {
    expect(getGrowthProgress(7)).toMatchObject({
      stageIndex: 1,
      remaining: 1,
      percentToNext: 86,
    });
  });

  it("56회부터 완성 정원이며 추가 참여도 계속 허용한다", () => {
    expect(getGrowthProgress(56)).toMatchObject({
      stageIndex: 8,
      nextStage: null,
      remaining: 0,
      percentToNext: 100,
    });
    expect(getGrowthProgress(91).stage.id).toBe("fruitGarden");
  });
});
