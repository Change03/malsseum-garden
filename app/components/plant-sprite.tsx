type PlantSpriteProps = {
  stage: number;
  size?: "small" | "medium" | "large";
  label?: string;
};

export function PlantSprite({ stage, size = "medium", label }: PlantSpriteProps) {
  const safeStage = Math.max(0, Math.min(8, Math.round(stage)));
  return (
    <div
      className={`plantSprite plantStage${safeStage} plantSprite-${size}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    />
  );
}
