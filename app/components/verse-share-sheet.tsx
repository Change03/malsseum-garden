"use client";

import { useEffect, useRef, useState } from "react";
import { CampaignDay, formatDay } from "./model";
import { VerseSelection } from "./external-content-panel";

type VerseShareSheetProps = {
  day: CampaignDay;
  open: boolean;
  selection: VerseSelection | null;
  verseOptions: VerseSelection[];
  onClose: () => void;
  completionMode?: boolean;
};

export function buildVerseShareText(
  day: Pick<CampaignDay, "date" | "passage">,
  selection: VerseSelection,
): string {
  const date = formatDay(day.date, {
    year: "numeric",
    month: "long",
    day: "numeric",
    weekday: "short",
  });
  return `${date}

“${selection.text}”

— ${selection.reference} · ${selection.translationLabel}
출처: ${selection.sourceUrl}`;
}

export function VerseShareSheet({
  day,
  open,
  selection,
  verseOptions,
  onClose,
  completionMode = false,
}: VerseShareSheetProps) {
  const [selected, setSelected] = useState<VerseSelection | null>(selection);
  const [showOptions, setShowOptions] = useState(!selection);
  const [status, setStatus] = useState("");
  const [showFallback, setShowFallback] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const fallbackRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!open) return;
    const timeout = window.setTimeout(() => closeRef.current?.focus(), 80);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose, open, selection]);

  if (!open) return null;

  function chooseVerse(next: VerseSelection) {
    setSelected(next);
    setShowOptions(false);
    setStatus("");
    setShowFallback(false);
  }

  function revealFallback(message: string) {
    setShowFallback(true);
    setStatus(message);
    window.setTimeout(() => fallbackRef.current?.select(), 60);
  }

  async function copyVerse() {
    if (!selected) {
      setStatus("본문에서 나누고 싶은 한 절을 먼저 골라 주세요.");
      setShowOptions(true);
      return;
    }
    try {
      await navigator.clipboard.writeText(buildVerseShareText(day, selected));
      setStatus("말씀을 복사했어요. 카카오톡에서 붙여넣어 보세요.");
    } catch {
      revealFallback(
        "자동 복사가 어려워 전체 문구를 준비했어요. 아래 칸을 길게 눌러 복사해 주세요.",
      );
    }
  }

  async function shareVerse() {
    if (!selected) {
      setStatus("본문에서 나누고 싶은 한 절을 먼저 골라 주세요.");
      setShowOptions(true);
      return;
    }
    if (typeof navigator.share !== "function") {
      try {
        await navigator.clipboard.writeText(buildVerseShareText(day, selected));
        setStatus("공유 기능 대신 말씀을 복사했어요. 카카오톡에 붙여넣어 주세요.");
      } catch {
        revealFallback(
          "이 기기에서는 바로 공유하기 어려워요. 아래 전체 문구를 길게 눌러 복사해 주세요.",
        );
      }
      return;
    }
    try {
      await navigator.share({
        title: `말씀정원 · ${selected.reference}`,
        text: buildVerseShareText(day, selected),
      });
      setStatus("휴대폰 공유창을 열었어요. 카카오톡을 선택해 주세요.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      revealFallback(
        "공유하지 못했어요. 아래 전체 문구를 길게 눌러 복사해 주세요.",
      );
    }
  }

  return (
    <div
      className="sheetBackdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        className="bottomSheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="verse-sheet-title"
      >
        {completionMode ? (
          <div className="completionCelebration" aria-hidden="true">
            <span className="celebrationDrop">◆</span>
            <span className="celebrationSprout">♧</span>
            <i>✦</i>
          </div>
        ) : null}
        <div className="sheetHandle" aria-hidden="true" />
        <button
          ref={closeRef}
          className="sheetClose"
          type="button"
          onClick={onClose}
          aria-label="닫기"
        >
          ×
        </button>
        <p className="eyebrow">
          {completionMode ? "ONE STEP ADDED" : "SELECT & SHARE"}
        </p>
        <h2 id="verse-sheet-title">
          {completionMode ? "오늘의 걸음을 더했어요" : "마음에 남은 말씀"}
        </h2>
        <p className="sheetIntro">
          {completionMode
            ? "물방울 하나가 공동 정원을 키웠어요. 아래 본문에서 한 절을 골라 바로 나눌 수 있어요."
            : "직접 글을 쓸 필요 없이, 오늘 본문에서 마음에 남은 한 절을 골라 주세요."}
        </p>

        {selected && !showOptions ? (
          <div className="selectedVerseCard">
            <p>
              <span aria-hidden="true">✓</span> {selected.reference} ·{" "}
              {selected.translationLabel}
            </p>
            <blockquote className="scriptureText">“{selected.text}”</blockquote>
            <button type="button" onClick={() => setShowOptions(true)}>
              다른 구절 고르기
            </button>
          </div>
        ) : (
          <div className="shareVerseChooser">
            <p>
              <strong>나누고 싶은 한 절</strong>
              <span>{verseOptions[0]?.translationLabel ?? "공개 본문"} · {verseOptions.length}절</span>
            </p>
            <div role="radiogroup" aria-label="공유할 성경 구절">
              {verseOptions.map((option) => (
                <button
                  type="button"
                  role="radio"
                  aria-checked={selected?.number === option.number}
                  className={selected?.number === option.number ? "selected" : ""}
                  key={option.number}
                  onClick={() => chooseVerse(option)}
                >
                  <sup>{option.number}</sup>
                  <span>{option.text}</span>
                  <i aria-hidden="true">
                    {selected?.number === option.number ? "✓" : "＋"}
                  </i>
                </button>
              ))}
            </div>
          </div>
        )}

        {status ? (
          <p className="formMessage" role="status">
            {status}
          </p>
        ) : null}
        {showFallback && selected ? (
          <label className="fallbackField">
            <span>전체 나눔 문구</span>
            <textarea
              ref={fallbackRef}
              readOnly
              value={buildVerseShareText(day, selected)}
              onFocus={(event) => event.currentTarget.select()}
            />
          </label>
        ) : null}
        <div className="sharePreview">
          <span>나눔에 포함되는 정보</span>
          <p>날짜 · 선택한 한 절 · 정확한 절 주소 · 역본명 · 출처</p>
        </div>
        <div className="sheetActions">
          <button type="button" className="quietButton" onClick={onClose}>
            {completionMode ? "완료만 하기" : "닫기"}
          </button>
          <button
            type="button"
            className="secondaryButton"
            disabled={!selected}
            onClick={copyVerse}
          >
            말씀 복사
          </button>
          <button
            type="button"
            className="primaryButton"
            disabled={!selected}
            onClick={shareVerse}
          >
            카카오톡으로 공유
          </button>
        </div>
      </section>
    </div>
  );
}
