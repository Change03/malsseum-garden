import { describe, expect, it } from "vitest";
import { buildVerseShareText } from "../../app/components/verse-share-sheet";

describe("verse share text", () => {
  it("contains only the chosen verse, reference, edition, and source", () => {
    const text = buildVerseShareText(
      {
        date: "2026-07-27",
        passage: "이사야 3:13–4:6",
      },
      {
        number: "3:13",
        reference: "이사야 3:13",
        text: "여호와께서 변론하러 일어나시며 백성들을 심판하려고 서시도다",
        translationLabel: "개역한글",
        sourceUrl: "https://www.bible.com/ko/bible/88/ISA.3.13.KRV",
      },
    );

    expect(text).toContain("2026년 7월 27일");
    expect(text).toContain("이사야 3:13 · 개역한글");
    expect(text).toContain(
      "출처: https://www.bible.com/ko/bible/88/ISA.3.13.KRV",
    );
    expect(text).not.toMatch(/참여자이름|참여율|invite|wordgarden_member/u);
    expect(text).not.toContain("이사야 3:13–4:6 · 개역한글");
  });
});
