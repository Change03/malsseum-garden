"use client";

import { useCallback, useRef, useState } from "react";
import { AppShell, InlineNotice } from "./app-shell";
import { CompletionMatrix } from "./completion-matrix";
import {
  completionFor,
  focusDay,
  formatDay,
  gardenForWeek,
} from "./model";
import { PlantSprite } from "./plant-sprite";
import { SharedCompletionSheet } from "./shared-completion-sheet";
import { ErrorScreen, LoadingScreen, SignedOutLanding, ConsentScreen } from "./state-screens";
import { useWeekData } from "./use-week-data";
import { WeekSelector } from "./week-strip";

export function TogetherScreen() {
  const { state, refresh, giveConsent, setSharedCompletion } = useWeekData(true);
  const [selectedParticipantId, setSelectedParticipantId] = useState<string | null>(null);
  const [busyKey, setBusyKey] = useState("");
  const busyKeyRef = useRef("");
  const [editStatus, setEditStatus] = useState("");
  const [editStatusTone, setEditStatusTone] = useState<"success" | "error">("success");
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number | null>(null);
  const closeEditor = useCallback(() => {
    if (busyKeyRef.current) return;
    setSelectedParticipantId(null);
    setEditStatus("");
  }, []);

  if (state.status === "loading") return <LoadingScreen />;
  if (state.status === "signed-out") return <SignedOutLanding />;
  if (state.status === "consent") return <ConsentScreen name={state.consent?.name ?? "참여자"} onConsent={giveConsent} />;
  if (state.status === "error" || !state.data) return <ErrorScreen message={state.message} onRetry={() => void refresh(false)} />;

  const data = state.data;
  const day = focusDay(data);
  const completedToday = day
    ? data.participants.filter((participant) => completionFor(data, participant.id, day.id)).length
    : 0;
  const visibleWeekNumber = selectedWeekNumber ?? data.activeWeekNumber;
  const selectedGarden = gardenForWeek(data, visibleWeekNumber);
  const percent = Math.round(selectedGarden.progress * 100);
  const selectedParticipant = data.participants.find(
    (participant) => participant.id === selectedParticipantId,
  ) ?? null;
  const orderedParticipants = [...data.participants].sort((left, right) => {
    if (left.id === data.currentUser.id) return -1;
    if (right.id === data.currentUser.id) return 1;
    return data.participants.indexOf(left) - data.participants.indexOf(right);
  });

  function openEditor(participantId: string) {
    if (busyKeyRef.current) return;
    setSelectedParticipantId(participantId);
    setEditStatus("");
  }

  async function toggleSharedCompletion(dayId: string, completed: boolean) {
    if (!selectedParticipant || busyKeyRef.current) return;
    const selectedDay = data.days.find((item) => item.id === dayId);
    const key = `${selectedParticipant.id}:${dayId}`;
    busyKeyRef.current = key;
    setBusyKey(key);
    setEditStatus("");
    try {
      await setSharedCompletion(selectedParticipant.id, dayId, completed);
      setEditStatusTone("success");
      setEditStatus(
        `${selectedParticipant.name}님의 ${selectedDay ? formatDay(selectedDay.date, { month: "numeric", day: "numeric" }) : "선택한 날짜"} 기록을 ${completed ? "읽음 완료" : "미완료"}로 바꿨어요.`,
      );
    } catch (error) {
      setEditStatusTone("error");
      setEditStatus(
        error instanceof Error
          ? error.message
          : "저장하지 못해 원래 상태로 되돌렸어요.",
      );
    } finally {
      busyKeyRef.current = "";
      setBusyKey("");
    }
  }

  return (
    <AppShell data={data} active="together" lastUpdated={state.lastUpdated}>
      {state.message ? <InlineNotice>{state.message}</InlineNotice> : null}
      <section className="togetherHero">
        <div>
          <p className="eyebrow">GROWING TOGETHER</p>
          <h1>혼자가 아니라서<br /><em>더 잘 자라요</em></h1>
          <p>15초마다 서로의 읽음 기록을 새로 받아요.</p>
        </div>
        <PlantSprite stage={selectedGarden.stage} size="medium" label={`${visibleWeekNumber}주차 공동 정원 ${selectedGarden.stage + 1}단계`} />
      </section>

      <WeekSelector
        data={data}
        selectedWeekNumber={visibleWeekNumber}
        onSelect={setSelectedWeekNumber}
      />

      {day ? (
        <section className="todayStatusSection" aria-labelledby="today-status-title">
          <div className="sectionHeading">
            <div><p className="eyebrow">TODAY AT A GLANCE</p><h2 id="today-status-title">오늘의 함께</h2></div>
            <span className="countBadge">{formatDay(day.date, { month: "numeric", day: "numeric" })}</span>
          </div>
          <p className="todayStatusHint">이름을 누르면 그 사람의 7일 기록을 함께 수정할 수 있어요.</p>
          <div className="todayStatusChips">
            {orderedParticipants.map((participant) => {
              const complete = completionFor(data, participant.id, day.id);
              const symbol = day.isFuture ? "–" : complete ? "✓" : "○";
              const status = day.isFuture
                ? "아직 시작 전"
                : complete
                  ? "읽음"
                  : "읽지 않음";
              return (
                <button
                  key={participant.id}
                  type="button"
                  className={complete ? "complete" : ""}
                  aria-label={`${participant.name}, ${status}. 7일 기록 수정하기`}
                  onClick={() => openEditor(participant.id)}
                ><i aria-hidden="true">{symbol}</i>{participant.name}</button>
              );
            })}
          </div>
        </section>
      ) : null}

      <section className="communityStats" aria-label="공동체 묵상 통계">
        <div><span>오늘 함께</span><strong>{completedToday}<i>명</i></strong></div>
        <div><span>{visibleWeekNumber}주차 걸음</span><strong>{selectedGarden.completedCount}<i>번</i></strong></div>
        <div><span>다음 단계까지</span><strong>{selectedGarden.remaining}<i>걸음</i></strong></div>
      </section>

      <section className="matrixSection" aria-labelledby="matrix-title">
        <div className="sectionHeading">
          <div><p className="eyebrow">OUR CHECKLIST</p><h2 id="matrix-title">함께 보는 체크표</h2></div>
          <span className="sharedEditBadge"><span aria-hidden="true">↗</span> 모두 수정</span>
        </div>
        <p className="sectionDescription">표의 이름을 누르면 누구든 그 사람의 체크를 정정할 수 있어요. 단톡방 공용 링크를 받은 13명이 함께 사용합니다.</p>
        <CompletionMatrix
          data={data}
          weekNumber={visibleWeekNumber}
          onParticipantSelect={openEditor}
        />
      </section>

      <section className="growthSummary">
        <div className="growthRing" style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}><span>{percent}<small>%</small></span></div>
        <div><p className="eyebrow">WEEK {visibleWeekNumber} · ONE TREE</p><h2>{visibleWeekNumber}주차 나무가<br />{selectedGarden.stage + 1}단계까지 자랐어요</h2><p>{selectedGarden.remaining > 0 ? `${selectedGarden.remaining}번의 말씀 걸음이 더 모이면 다음 모습으로 자라요.` : "56번 이상의 걸음이 모여 정원이 활짝 완성됐어요."}</p></div>
      </section>

      <p className="privacyFooter"><span aria-hidden="true">●</span> 공용 링크를 받은 모임 사람이 함께 보고 수정할 수 있습니다.</p>
      <SharedCompletionSheet
        data={data}
        participant={selectedParticipant}
        busyKey={busyKey}
        status={editStatus}
        statusTone={editStatusTone}
        weekNumber={visibleWeekNumber}
        onToggle={(dayId, completed) => void toggleSharedCompletion(dayId, completed)}
        onClose={closeEditor}
      />
    </AppShell>
  );
}
