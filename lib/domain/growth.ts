export const MAX_COMPLETION_COUNT = 91;
export const GARDEN_COMPLETION_GOAL = 56;

export const GROWTH_STAGES = [
  { id: "seed", label: "씨앗", min: 0, max: 0 },
  { id: "sprout", label: "작은 새싹", min: 1, max: 7 },
  { id: "stem", label: "줄기", min: 8, max: 15 },
  { id: "leafyPlant", label: "잎이 난 식물", min: 16, max: 23 },
  { id: "youngTree", label: "어린 나무", min: 24, max: 31 },
  { id: "fullBranches", label: "풍성한 가지", min: 32, max: 39 },
  { id: "flowerBuds", label: "꽃봉오리", min: 40, max: 47 },
  { id: "floweringTree", label: "꽃이 핀 나무", min: 48, max: 55 },
  { id: "fruitGarden", label: "열매 맺은 완성 정원", min: 56, max: 91 },
] as const;

export type GrowthStage = (typeof GROWTH_STAGES)[number];
export type GrowthStageId = GrowthStage["id"];

function assertCompletionCount(total: number) {
  if (!Number.isInteger(total) || total < 0 || total > MAX_COMPLETION_COUNT) {
    throw new RangeError(
      `Completion count must be an integer from 0 to ${MAX_COMPLETION_COUNT}.`,
    );
  }
}

export function getGrowthStage(total: number): GrowthStage {
  assertCompletionCount(total);

  const stage = GROWTH_STAGES.find(
    ({ min, max }) => total >= min && total <= max,
  );

  if (!stage) {
    throw new RangeError(`No growth stage exists for completion count ${total}.`);
  }

  return stage;
}

export function getGrowthProgress(total: number) {
  const stage = getGrowthStage(total);
  const stageIndex = GROWTH_STAGES.indexOf(stage);
  const nextStage = GROWTH_STAGES[stageIndex + 1] ?? null;

  if (!nextStage) {
    return {
      stage,
      stageIndex,
      nextStage,
      remaining: 0,
      percentToNext: 100,
    } as const;
  }

  const span = nextStage.min - stage.min;
  const progressed = total - stage.min;

  return {
    stage,
    stageIndex,
    nextStage,
    remaining: nextStage.min - total,
    percentToNext: Math.round((progressed / span) * 100),
  } as const;
}
