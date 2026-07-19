"use client";

import { useEffect, useRef } from "react";
import {
  completionFor,
  daysForWeek,
  formatDay,
  Participant,
  WeekData,
} from "./model";

type SharedCompletionSheetProps = {
  data: WeekData;
  participant: Participant | null;
  busyKey: string;
  status: string;
  statusTone: "success" | "error";
  onToggle: (dayId: string, completed: boolean) => void;
  onClose: () => void;
  weekNumber: number;
};

export function SharedCompletionSheet({
  data,
  participant,
  busyKey,
  status,
  statusTone,
  onToggle,
  onClose,
  weekNumber,
}: SharedCompletionSheetProps) {
  const backdropRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const participantId = participant?.id ?? null;

  useEffect(() => {
    if (!participantId) return;
    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const backdrop = backdropRef.current;
    const appFrame = backdrop?.closest(".appFrame");
    const backgroundElements = [
      ...(appFrame
        ? Array.from(appFrame.children).filter(
            (element): element is HTMLElement =>
              element instanceof HTMLElement && !element.contains(backdrop),
          )
        : []),
      ...(backdrop?.parentElement
        ? Array.from(backdrop.parentElement.children).filter(
            (element): element is HTMLElement =>
              element instanceof HTMLElement && element !== backdrop,
          )
        : []),
    ];
    const inertStates = backgroundElements.map((element) => ({
      element,
      inert: element.inert,
    }));
    inertStates.forEach(({ element }) => { element.inert = true; });
    const timeout = window.setTimeout(() => closeRef.current?.focus(), 80);
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
        return;
      }
      if (event.key !== "Tab") return;
      const focusable = Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ) ?? [],
      ).filter((element) => !element.hidden);
      if (!focusable.length) {
        event.preventDefault();
        dialogRef.current?.focus();
        return;
      }
      const first = focusable[0];
      const last = focusable.at(-1) ?? first;
      if (!dialogRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("keydown", onKeyDown);
      inertStates.forEach(({ element, inert }) => { element.inert = inert; });
      document.body.style.overflow = previousBodyOverflow;
      previousFocusRef.current?.focus();
    };
  }, [onClose, participantId]);

  if (!participant) return null;

  const isMe = participant.id === data.currentUser.id;
  const days = daysForWeek(data, weekNumber);

  return (
    <div
      ref={backdropRef}
      className="sheetBackdrop"
      onMouseDown={(event) => event.target === event.currentTarget && onClose()}
    >
      <section
        ref={dialogRef}
        className="bottomSheet sharedCompletionSheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="shared-completion-title"
        aria-describedby="shared-completion-intro"
        aria-busy={Boolean(busyKey)}
        tabIndex={-1}
      >
        <div className="sheetHandle" aria-hidden="true" />
        <button
          ref={closeRef}
          className="sheetClose"
          type="button"
          disabled={Boolean(busyKey)}
          onClick={onClose}
          aria-label="기록 수정 창 닫기"
        >×</button>
        <p className="eyebrow">SHARED CHECKLIST</p>
        <h2 id="shared-completion-title">
          {participant.name}{isMe ? "(나)" : ""}님의 {weekNumber}주차
        </h2>
        <p className="sheetIntro" id="shared-completion-intro">
          날짜를 눌러 읽음 표시를 함께 정정할 수 있어요. 미래 날짜와 종료된 기간은 잠겨 있어요.
        </p>
        <p className="sharedEditPolicy">
          <span aria-hidden="true">↗</span>
          공용 링크를 받은 13명 모두 수정할 수 있고, 선택 중인 이름과 수정 시각이 운영 기록에 남아요.
        </p>

        <div className="sharedDayList" role="group" aria-label={`${participant.name}님의 날짜별 읽음 기록`}>
          {days.map((day) => {
            const complete = completionFor(data, participant.id, day.id);
            const key = `${participant.id}:${day.id}`;
            const busy = busyKey === key;
            const unavailable = Boolean(busyKey) || !day.canComplete;
            const lockedLabel = day.isFuture
              ? "아직 시작 전"
              : "수정 기간 종료";
            const stateLabel = !day.canComplete
              ? lockedLabel
              : complete
                ? "읽음 완료"
                : "표시 전";
            const actionLabel = !day.canComplete
              ? "변경할 수 없음"
              : complete
                ? "누르면 읽음 표시 취소"
                : "누르면 읽음 완료로 변경";
            return (
              <button
                key={day.id}
                type="button"
                className={complete ? "sharedDayButton complete" : "sharedDayButton"}
                aria-label={busy
                  ? `${participant.name}, ${formatDay(day.date)}, 저장 중`
                  : `${participant.name}, ${formatDay(day.date)}, ${stateLabel}. ${actionLabel}`}
                aria-pressed={complete}
                aria-disabled={unavailable}
                disabled={!day.canComplete || (Boolean(busyKey) && !busy)}
                onClick={() => { if (!unavailable) onToggle(day.id, !complete); }}
              >
                <span className="sharedDayDate">
                  <strong>{formatDay(day.date, { month: "numeric", day: "numeric", weekday: "short" })}</strong>
                  <small>DAY {day.order}</small>
                </span>
                <span className="sharedDayPassage">{day.passage}</span>
                <strong className="sharedDayState">
                  <i aria-hidden="true">{busy ? "…" : day.isFuture ? "–" : complete ? "✓" : "○"}</i>
                  {busy ? "저장 중" : stateLabel}
                </strong>
              </button>
            );
          })}
        </div>

        {status ? (
          <p
            className={`sharedEditStatus ${statusTone}`}
            role={statusTone === "error" ? "alert" : "status"}
          >{status}</p>
        ) : null}
      </section>
    </div>
  );
}
