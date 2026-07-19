"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AppShell, InlineNotice } from "./app-shell";
import {
  ExternalContentPanel,
  shareableVerseOptions,
  VerseSelection,
} from "./external-content-panel";
import {
  completionFor,
  formatDay,
  variantsForDay,
} from "./model";
import { ErrorScreen, LoadingScreen, SignedOutLanding, ConsentScreen } from "./state-screens";
import { useWeekData } from "./use-week-data";
import { VerseShareSheet } from "./verse-share-sheet";
import { WeekStrip } from "./week-strip";

export function DayScreen({ dayId }: { dayId: string }) {
  const { state, refresh, giveConsent, setMyCompletion } = useWeekData(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [completionSheet, setCompletionSheet] = useState(false);
  const [saving, setSaving] = useState(false);
  const [selectedVerse, setSelectedVerse] = useState<VerseSelection | null>(null);
  const closeSheet = useCallback(() => setSheetOpen(false), []);
  const updateShareContext = useCallback(
    (selection: VerseSelection | null) => setSelectedVerse(selection),
    [],
  );

  if (state.status === "loading") return <LoadingScreen />;
  if (state.status === "signed-out") return <SignedOutLanding />;
  if (state.status === "consent") return <ConsentScreen name={state.consent?.name ?? "참여자"} onConsent={giveConsent} />;
  if (state.status === "error" || !state.data) return <ErrorScreen message={state.message} onRetry={() => void refresh(false)} />;

  const data = state.data;
  const day = data.days.find((item) => item.id === dayId || item.date === dayId);
  if (!day) {
    return (
      <AppShell data={data} active="home" lastUpdated={state.lastUpdated}>
        <section className="notFoundCard"><span aria-hidden="true">?</span><h1>이 날짜는 찾을 수 없어요</h1><p>14일 일정 안에서 다시 골라 주세요.</p><Link className="primaryButton" href="/">오늘로 돌아가기</Link></section>
      </AppShell>
    );
  }

  const completed = completionFor(data, data.currentUser.id, day.id);
  const completionDayId = day.id;
  const future = day.isFuture;
  const canComplete = day.canComplete;
  const index = data.days.findIndex((item) => item.id === day.id);
  const previous = data.days[index - 1];
  const next = data.days[index + 1];
  const variants = variantsForDay(data, day);
  const verseOptions = shareableVerseOptions(variants);

  async function toggleCompletion() {
    if (saving || !canComplete) return;
    const nextCompleted = !completed;
    setSaving(true);
    try {
      await setMyCompletion(completionDayId, nextCompleted);
      if (nextCompleted) {
        setCompletionSheet(true);
        setSheetOpen(true);
      }
    } catch {
      return;
    } finally {
      setSaving(false);
    }
  }

  const stickyAction = (
    <button
      type="button"
      className={`completionCta ${completed ? "isComplete" : ""}`}
      onClick={toggleCompletion}
      disabled={saving || !canComplete}
      aria-pressed={completed}
    >
      <span className="completionCtaIcon" aria-hidden="true">{completed ? "✓" : "○"}</span>
      <span><strong>{!canComplete ? future ? "아직 읽음 표시를 할 수 없어요" : "읽음 기록 기간이 끝났어요" : completed ? "읽음 완료" : "다 읽었어요"}</strong><small>{!canComplete ? future ? `${formatDay(day.date)}에 체크할 수 있어요` : "기록은 그대로 안전하게 보관돼요" : completed ? "오늘의 걸음이 나무에 더해졌어요" : "우리의 나무에 한 걸음을 더해요"}</small></span>
      <i aria-hidden="true">{saving ? "…" : completed ? "완료" : "+1"}</i>
    </button>
  );

  return (
    <AppShell data={data} active="home" lastUpdated={state.lastUpdated} stickyAction={stickyAction}>
      {state.message ? <InlineNotice>{state.message}</InlineNotice> : null}
      <nav className="dayTopNav" aria-label="날짜 탐색">
        {previous ? <Link href={`/day/${encodeURIComponent(previous.date)}`} aria-label="이전 날">←</Link> : <span />}
        <div><p>WEEK {day.weekNumber} · DAY {day.weekDayOrder}</p><strong>{formatDay(day.date)}</strong></div>
        {next ? <Link href={`/day/${encodeURIComponent(next.date)}`} aria-label="다음 날">→</Link> : <span />}
      </nav>

      <section className="dayHero">
        <div className="dayHeroStatus"><span className={completed ? "complete" : ""}>{completed ? "✓ 읽음 완료" : future ? "곧 만나요" : "오늘의 말씀"}</span></div>
        <p className="eyebrow">{day.title}</p>
        <h1 className="scriptureText">{day.passage}</h1>
        <p>말씀을 읽기 전, 잠시 숨을 고르고 마음을 열어 보세요.</p>
        <div className="dayHeroOrnament" aria-hidden="true"><span /><i>✦</i><span /></div>
      </section>

      <WeekStrip data={data} selectedDayId={day.id} />
      <ExternalContentPanel key={day.id} day={day} variants={variants} onVerseSelection={updateShareContext} />

      <section className="memoryCard">
        <div className="memoryIcon" aria-hidden="true">✎</div>
        <div><p className="eyebrow">SELECT &amp; SHARE</p><h2>마음에 남은 말씀</h2><p>오늘 본문에서 한 절을 골라 복사하거나 카카오톡으로 바로 나눠 보세요.</p></div>
        <button type="button" onClick={() => { setCompletionSheet(false); setSheetOpen(true); }}>{selectedVerse ? "선택한 말씀 나누기" : "한 절 고르기"} <span aria-hidden="true">→</span></button>
      </section>

      <section className="dayNavigation" aria-label="앞뒤 묵상">
        {previous ? <Link href={`/day/${encodeURIComponent(previous.date)}`}><span>이전 묵상</span><strong>← {previous.passage}</strong></Link> : <span />}
        {next ? <Link href={`/day/${encodeURIComponent(next.date)}`}><span>다음 묵상</span><strong>{next.passage} →</strong></Link> : <span />}
      </section>
      {sheetOpen ? <VerseShareSheet
        day={day}
        open
        selection={selectedVerse}
        verseOptions={verseOptions}
        completionMode={completionSheet}
        onClose={closeSheet}
      /> : null}
    </AppShell>
  );
}
