"use client";

import Link from "next/link";
import { useState } from "react";
import { AppShell, InlineNotice } from "./app-shell";
import { shareableVerseOptions } from "./external-content-panel";
import { PlantSprite } from "./plant-sprite";
import {
  completionFor,
  daysForWeek,
  focusDay,
  formatDay,
  gardenForWeek,
  variantsForDay,
} from "./model";
import { ErrorScreen, LoadingScreen, SignedOutLanding, ConsentScreen } from "./state-screens";
import { useWeekData } from "./use-week-data";
import { VerseShareSheet } from "./verse-share-sheet";
import { WeekStrip } from "./week-strip";

export function HomeScreen() {
  const { state, refresh, giveConsent, setMyCompletion } = useWeekData(true);
  const [saving, setSaving] = useState(false);
  const [sheetOpen, setSheetOpen] = useState(false);

  if (state.status === "loading") return <LoadingScreen />;
  if (state.status === "signed-out") return <SignedOutLanding />;
  if (state.status === "consent") return <ConsentScreen name={state.consent?.name ?? "참여자"} onConsent={giveConsent} />;
  if (state.status === "error" || !state.data) return <ErrorScreen message={state.message} onRetry={() => void refresh(false)} />;

  const data = state.data;
  const day = focusDay(data);
  if (!day) return <ErrorScreen message="이번 주 읽기 일정이 아직 준비되지 않았어요." onRetry={() => void refresh(false)} />;
  const completed = completionFor(data, data.currentUser.id, day.id);
  const completionDayId = day.id;
  const future = day.isFuture;
  const canComplete = day.canComplete;
  const garden = gardenForWeek(data, day.weekNumber);
  const weekDays = daysForWeek(data, day.weekNumber);
  const percent = Math.round(garden.percentToNext);
  const participantCount = data.participants.length;
  const completedToday = data.completions.filter((item) => item.dayId === day.id && item.completed).length;
  const verseOptions = shareableVerseOptions(variantsForDay(data, day));

  async function toggleCompletion() {
    if (saving || !canComplete) return;
    const nextCompleted = !completed;
    setSaving(true);
    try {
      await setMyCompletion(completionDayId, nextCompleted);
      if (nextCompleted) setSheetOpen(true);
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
      disabled={saving || !canComplete}
      aria-pressed={completed}
      onClick={toggleCompletion}
    >
      <span className="completionCtaIcon" aria-hidden="true">{completed ? "✓" : "○"}</span>
      <span><strong>{!canComplete ? future ? `${formatDay(day.date, { month: "numeric", day: "numeric" })}에 열려요` : "읽음 기록 기간이 끝났어요" : completed ? "오늘 읽음 완료" : "말씀을 읽었어요"}</strong><small>{!canComplete ? "기록은 그대로 안전하게 보관돼요" : completed ? "누르면 읽음 표시를 취소할 수 있어요" : "체크하면 우리의 나무가 자라요"}</small></span>
      <i aria-hidden="true">{saving ? "…" : "+1"}</i>
    </button>
  );

  return (
    <AppShell data={data} active="home" lastUpdated={state.lastUpdated} stickyAction={stickyAction}>
      {state.message ? <InlineNotice>{state.message}</InlineNotice> : null}
      <section className="homeHero">
        <div className="heroCopy">
          <p className="eyebrow">TODAY’S LITTLE SEED · DAY {day.order}</p>
          <h1>{data.currentUser.name}님,<br /><em>말씀 한 모금</em> 어때요?</h1>
          <p>{data.phase.message || "오늘의 작은 묵상이 우리 모두의 나무를 키워요."}</p>
        </div>
        <div className="heroPlantWrap">
          <span className="stagePill">WEEK {day.weekNumber} · STAGE {garden.stage + 1}</span>
          <PlantSprite stage={garden.stage} size="large" label={`${day.weekNumber}주차 공동 정원 성장 ${garden.stage + 1}단계`} />
        </div>
      </section>

      <section className="gardenProgressCard" aria-label="공동체 성장 현황">
        <div className="progressTopline">
          <div><span className="pulseDot" aria-hidden="true" />오늘 <strong>{completedToday}/{participantCount}명</strong></div>
          <strong>{garden.nextLabel ?? "완성 정원"} {percent}%</strong>
        </div>
        <div className="progressTrack"><span style={{ width: `${percent}%` }} /></div>
        <div className="avatarSummary">
          <div className="avatarStack" aria-hidden="true">
            {data.participants.slice(0, 5).map((participant, index) => (
              <span key={participant.id} style={{ zIndex: 5 - index }}>{participant.name.slice(0, 1)}</span>
            ))}
          </div>
          <p>{day.weekNumber}주차 {garden.completedCount}/{garden.totalCount}회 · {garden.remaining > 0 ? `다음 단계까지 ${garden.remaining}걸음` : "완성 목표 달성"}</p>
        </div>
      </section>

      <section className="todayCard" aria-labelledby="today-reading-title">
        <div className="todayCardLabel"><span>오늘 심을 말씀 한 알</span><i aria-hidden="true">{completed ? "새싹이 났어요 ✓" : "물 주기 전"}</i></div>
        <p>{formatDay(day.date)}</p>
        <h2 id="today-reading-title" className="scriptureText">{day.passage}</h2>
        <h3>{day.title}</h3>
        <p className="todayCardCopy">개역한글 본문과 말씀정원 자체 해설은 여기서 바로 읽어요. 다른 번역과 매일성경 해설은 공식 페이지로 연결됩니다.</p>
        <Link className="primaryButton" href={`/day/${encodeURIComponent(day.date)}`}>
          오늘 묵상 열기 <span aria-hidden="true">→</span>
        </Link>
        <div className="variantMiniList" aria-label="제공 판본">
          <span>개역한글 본문</span><span>말씀정원 해설</span><span>절 선택 공유</span>
        </div>
      </section>

      <section className="weekSection" id="my-week" aria-labelledby="week-title">
        <div className="sectionHeading">
          <div><p className="eyebrow">MY TWO WEEKS</p><h2 id="week-title">나의 {day.weekNumber}주차</h2></div>
          <span className="countBadge">{weekDays.filter((item) => completionFor(data, data.currentUser.id, item.id)).length} / {weekDays.length}</span>
        </div>
        <WeekStrip data={data} selectedDayId={day.id} />
      </section>

      <Link className="togetherBanner" href="/together">
        <div><span aria-hidden="true">♧</span></div>
        <p><strong>함께 피우는 기록</strong><small>{participantCount}명 × 7일 · 두 번의 정원을 함께 키워요</small></p>
        <i aria-hidden="true">→</i>
      </Link>
      {sheetOpen ? <VerseShareSheet
        day={day}
        open
        selection={null}
        verseOptions={verseOptions}
        completionMode
        onClose={() => setSheetOpen(false)}
      /> : null}
    </AppShell>
  );
}
