import { describe, expect, it } from "vitest";
import { BUILT_IN_VARIANT_SEEDS } from "../../lib/server/built-in-content";

const expectedCounts: Record<string, number> = {
  d1: 18,
  d2: 15,
  d3: 15,
  d4: 16,
  d5: 6,
  d6: 22,
  d7: 23,
  d8: 18,
  d9: 14,
  d10: 14,
  d11: 22,
  d12: 16,
  d13: 17,
  d14: 25,
};

const expectedBounds: Record<string, [string, string]> = {
  d1: ["9:8", "10:4"],
  d2: ["10:5", "10:19"],
  d3: ["10:20", "10:34"],
  d4: ["11:1", "11:16"],
  d5: ["12:1", "12:6"],
  d6: ["13:1", "13:22"],
  d7: ["14:1", "14:23"],
  d8: ["14:24", "15:9"],
  d9: ["16:1", "16:14"],
  d10: ["17:1", "17:14"],
  d11: ["18:1", "19:15"],
  d12: ["19:16", "20:6"],
  d13: ["21:1", "21:17"],
  d14: ["22:1", "22:25"],
};

describe("built-in devotional content", () => {
  it("provides one public-domain Bible and one original commentary for all fourteen days", () => {
    expect(BUILT_IN_VARIANT_SEEDS).toHaveLength(28);

    for (const dayId of Object.keys(expectedCounts)) {
      const dayVariants = BUILT_IN_VARIANT_SEEDS.filter(
        (variant) => variant.dayId === dayId,
      );
      expect(dayVariants).toHaveLength(2);

      const bible = dayVariants.find((variant) => variant.kind === "bible");
      const commentary = dayVariants.find(
        (variant) => variant.kind === "commentary",
      );

      expect(bible?.key).toBe("krv");
      expect(bible?.rightsBasis).toBe("public_domain");
      expect(bible?.copyAllowed).toBe(true);
      expect(bible?.maxCopyVerses).toBe(1);
      expect(bible?.body.verses).toHaveLength(expectedCounts[dayId]);
      expect(bible?.body.verses?.[0]?.number).toBe(expectedBounds[dayId][0]);
      expect(bible?.body.verses?.at(-1)?.number).toBe(expectedBounds[dayId][1]);

      expect(commentary?.key).toBe("wordgarden");
      expect(commentary?.rightsBasis).toBe("owned");
      expect(commentary?.copyAllowed).toBe(false);
      expect(commentary?.body.paragraphs).toHaveLength(3);
    }
  });

  it("keeps every shareable verse uniquely referenced and sourced", () => {
    const verses = BUILT_IN_VARIANT_SEEDS.flatMap(
      (variant) => variant.body.verses ?? [],
    );

    expect(verses).toHaveLength(241);
    expect(new Set(verses.map((verse) => verse.reference)).size).toBe(241);
    expect(
      verses.every(
        (verse) =>
          verse.reference === `이사야 ${verse.number}` &&
          verse.text.trim().length > 0 &&
          verse.sourceUrl.startsWith("https://www.bible.com/ko/bible/88/ISA."),
      ),
    ).toBe(true);
  });

  it("does not embed copyrighted modern Korean editions", () => {
    const embeddedLabels = BUILT_IN_VARIANT_SEEDS.map(
      (variant) => variant.label,
    );

    expect(embeddedLabels).not.toContain("개역개정");
    expect(embeddedLabels).not.toContain("새번역");
    expect(embeddedLabels).not.toContain("쉬운성경");
    expect(embeddedLabels).not.toContain("매일성경");
    expect(embeddedLabels).not.toContain("매일성경 순");
  });
});
