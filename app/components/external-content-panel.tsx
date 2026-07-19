"use client";

import { useEffect, useMemo, useState } from "react";
import { CampaignDay, ContentVariant, formatDay } from "./model";

export type VerseSelection = {
  text: string;
  number: string;
  reference: string;
  translationLabel: string;
  sourceUrl: string;
};

type ExternalContentPanelProps = {
  day: CampaignDay;
  variants: ContentVariant[];
  onVerseSelection?: (
    selection: VerseSelection | null,
    translationLabel: string,
    sourceUrl: string,
  ) => void;
};

export function shareableVerseOptions(
  variants: ContentVariant[],
): VerseSelection[] {
  const variant = prioritizeEmbedded(
    variants.filter(
      (item) =>
        item.category === "scripture" &&
        item.mode === "embedded" &&
        item.copyAllowed &&
        item.maxCopyVerses >= 1 &&
        item.verses.length > 0,
    ),
  )[0];
  if (!variant) return [];
  return variant.verses.map((verse) => ({
    text: verse.text,
    number: verse.number,
    reference: verse.reference || `이사야 ${verse.number}`,
    translationLabel: variant.label,
    sourceUrl: verse.sourceUrl || variant.externalUrl,
  }));
}

export function ExternalContentPanel({
  day,
  variants,
  onVerseSelection,
}: ExternalContentPanelProps) {
  const scriptures = useMemo(
    () => prioritizeEmbedded(variants.filter((variant) => variant.category === "scripture")),
    [variants],
  );
  const commentaries = useMemo(
    () => prioritizeEmbedded(variants.filter((variant) => variant.category === "commentary")),
    [variants],
  );
  const [tab, setTab] = useState<"scripture" | "commentary">("scripture");
  const [scriptureId, setScriptureId] = useState(scriptures[0]?.id ?? "");
  const [commentaryId, setCommentaryId] = useState(commentaries[0]?.id ?? "");
  const [selectedVerseNumber, setSelectedVerseNumber] = useState("");

  const scripture =
    scriptures.find((variant) => variant.id === scriptureId) ?? scriptures[0];
  const commentary =
    commentaries.find((variant) => variant.id === commentaryId) ?? commentaries[0];
  const active = tab === "scripture" ? scripture : commentary;
  const activeScriptureId = scripture?.id ?? "";
  const activeScriptureLabel = scripture?.label ?? "";
  const activeScriptureUrl = scripture?.externalUrl ?? "";

  useEffect(() => {
    if (!activeScriptureId) return;
    onVerseSelection?.(null, activeScriptureLabel, activeScriptureUrl);
  }, [
    activeScriptureId,
    activeScriptureLabel,
    activeScriptureUrl,
    onVerseSelection,
  ]);

  function selectScripture(id: string) {
    const next = scriptures.find((variant) => variant.id === id);
    if (!next) return;
    setScriptureId(id);
    setSelectedVerseNumber("");
    onVerseSelection?.(null, next.label, next.externalUrl);
  }

  function selectCommentary(id: string) {
    const next = commentaries.find((variant) => variant.id === id);
    if (!next) return;
    setCommentaryId(id);
    if (/순/.test(next.label)) {
      const newTranslation = scriptures.find((variant) => /새번역/.test(variant.label));
      if (newTranslation) selectScripture(newTranslation.id);
    }
  }

  function selectVerse(variant: ContentVariant, verse: ContentVariant["verses"][number]) {
    if (!variant.copyAllowed || variant.maxCopyVerses < 1) return;
    const nextNumber = selectedVerseNumber === verse.number ? "" : verse.number;
    setSelectedVerseNumber(nextNumber);
    onVerseSelection?.(
      nextNumber
        ? {
            text: verse.text,
            number: verse.number,
            reference: verse.reference || `이사야 ${verse.number}`,
            translationLabel: variant.label,
            sourceUrl: verse.sourceUrl || variant.externalUrl,
          }
        : null,
      variant.label,
      verse.sourceUrl || variant.externalUrl,
    );
  }

  return (
    <section className="contentPanel" id="reading-content" aria-labelledby="content-title">
      <div className="sectionHeading">
        <div>
          <p className="eyebrow">READ &amp; REFLECT</p>
          <h2 id="content-title">오늘 말씀 읽기</h2>
        </div>
        <span className="sourceBadge">
          <span aria-hidden="true">✦</span> 본문 · 해설
        </span>
      </div>

      <div className="contentAxisTabs" role="tablist" aria-label="본문과 해설 선택">
        <button
          type="button"
          role="tab"
          aria-selected={tab === "scripture"}
          className={tab === "scripture" ? "active" : ""}
          onClick={() => setTab("scripture")}
        >
          본문
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={tab === "commentary"}
          className={tab === "commentary" ? "active" : ""}
          onClick={() => setTab("commentary")}
        >
          해설
        </button>
      </div>

      {tab === "scripture" ? (
        <div className="contentChoiceGroup">
          <div className="choiceLabel">
            <strong>성경 번역</strong>
            <span>개역한글은 여기서 바로 읽을 수 있어요</span>
          </div>
          <div className="variantTabs" role="radiogroup" aria-label="성경 번역">
            {scriptures.map((variant) => (
              <button
                key={variant.id}
                type="button"
                role="radio"
                aria-checked={scripture?.id === variant.id}
                className={scripture?.id === variant.id ? "active" : ""}
                onClick={() => selectScripture(variant.id)}
              >
                {variant.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="contentChoiceGroup">
          <div className="choiceLabel">
            <strong>QT 해설</strong>
            <span>말씀정원 해설은 사이트에서 바로 읽어요</span>
          </div>
          <div className="variantTabs" role="radiogroup" aria-label="해설 판본">
            {commentaries.map((variant) => (
              <button
                key={variant.id}
                type="button"
                role="radio"
                aria-checked={commentary?.id === variant.id}
                className={commentary?.id === variant.id ? "active" : ""}
                onClick={() => selectCommentary(variant.id)}
              >
                {variant.label}
              </button>
            ))}
          </div>
          <p className="editionHint">
            <span aria-hidden="true">ⓘ</span> 말씀정원 해설은 성서유니온 매일성경 해설을
            옮긴 글이 아니라, 오늘 본문을 바탕으로 새로 쓴 묵상 도움말이에요.
          </p>
        </div>
      )}

      {active ? (
        canEmbed(active) ? (
          <EmbeddedContent
            day={day}
            variant={active}
            selectedVerseNumber={selectedVerseNumber}
            onSelectVerse={(verse) => selectVerse(active, verse)}
          />
        ) : (
          <ExternalOnlyContent day={day} variant={active} />
        )
      ) : (
        <div className="externalReadingCard emptyContent">
          <p>이 종류의 콘텐츠가 아직 연결되지 않았어요.</p>
        </div>
      )}
    </section>
  );
}

function EmbeddedContent({
  day,
  variant,
  selectedVerseNumber,
  onSelectVerse,
}: {
  day: CampaignDay;
  variant: ContentVariant;
  selectedVerseNumber: string;
  onSelectVerse: (verse: ContentVariant["verses"][number]) => void;
}) {
  const selectable =
    variant.category === "scripture" &&
    variant.copyAllowed &&
    variant.maxCopyVerses >= 1;
  const rightsBadge =
    variant.rightsBasis === "public_domain"
      ? "공개 본문"
      : variant.rightsBasis === "owned"
        ? "자체 작성"
        : "사용 허가됨";

  return (
    <article className="embeddedReading" role="tabpanel">
      <div className="embeddedHeader">
        <div>
          <p>{variant.label}</p>
          <h3 className="scriptureText">{variant.heading || day.passage}</h3>
        </div>
        <span>{rightsBadge}</span>
      </div>
      {variant.category === "scripture" ? (
        <div className="embeddedVerses">
          {variant.verses.map((verse) =>
            selectable ? (
              <button
                type="button"
                key={verse.number}
                className={selectedVerseNumber === verse.number ? "selected" : ""}
                aria-pressed={selectedVerseNumber === verse.number}
                aria-label={`${verse.reference || `이사야 ${verse.number}`}, ${selectedVerseNumber === verse.number ? "공유 구절로 선택됨" : "공유 구절로 선택"}`}
                onClick={() => onSelectVerse(verse)}
              >
                <sup>{verse.number}</sup>
                <span>{verse.text}</span>
                <i aria-hidden="true">
                  {selectedVerseNumber === verse.number ? "✓" : "＋"}
                </i>
              </button>
            ) : (
              <p key={verse.number}>
                <sup>{verse.number}</sup>
                {verse.text}
              </p>
            ),
          )}
        </div>
      ) : (
        <div className="embeddedCommentary">
          {variant.paragraphs.map((paragraph, index) => (
            <p key={`${index}-${paragraph.slice(0, 12)}`}>{paragraph}</p>
          ))}
        </div>
      )}
      {selectable ? (
        <p className="selectionHint">
          <span aria-hidden="true">＋</span> 마음에 남은 한 절을 누르면 바로 복사하거나
          카카오톡으로 나눌 수 있어요.
        </p>
      ) : null}
      <div className="rightsLine">
        <span>{variant.sourceName || variant.rightsNotice || rightsBadge}</span>
        {variant.rightsUrl ? (
          <a href={variant.rightsUrl} target="_blank" rel="noreferrer">
            권리 안내 ↗
          </a>
        ) : variant.rightsExpiresAt ? (
          <span>
            {formatDay(variant.rightsExpiresAt.slice(0, 10), {
              year: "numeric",
              month: "numeric",
              day: "numeric",
            })}
            까지
          </span>
        ) : null}
      </div>
    </article>
  );
}

function ExternalOnlyContent({
  day,
  variant,
}: {
  day: CampaignDay;
  variant: ContentVariant;
}) {
  return (
    <div className="externalReadingCard" role="tabpanel">
      <div className="readingQuote" aria-hidden="true">
        “
      </div>
      <p className="scriptureLabel">{variant.label}</p>
      <h3 className="scriptureText">{day.passage}</h3>
      <p>{variant.description}</p>
      <div className="copyrightNote">
        <span aria-hidden="true">ⓘ</span>
        <p>
          <strong>이 판본은 공식 페이지에서 읽어요.</strong>
          <br />
          저작권을 존중해 허가되지 않은 본문과 해설을 복사해 두지 않습니다.
        </p>
      </div>
      <a
        className="secondaryButton"
        href={variant.externalUrl}
        target="_blank"
        rel="noreferrer"
      >
        공식 페이지에서 {variant.label} 보기 <span aria-hidden="true">↗</span>
      </a>
    </div>
  );
}

function prioritizeEmbedded(variants: ContentVariant[]): ContentVariant[] {
  return [...variants].sort(
    (left, right) => Number(right.mode === "embedded") - Number(left.mode === "embedded"),
  );
}

function canEmbed(variant: ContentVariant): boolean {
  if (variant.mode !== "embedded") return false;
  return variant.category === "scripture"
    ? variant.verses.length > 0
    : variant.paragraphs.length > 0;
}
