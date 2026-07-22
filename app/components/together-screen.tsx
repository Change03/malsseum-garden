"use client";

import { useCallback, useRef, useState } from "react";
import { AppShell, InlineNotice } from "./app-shell";
import { CompletionMatrix } from "./completion-matrix";
import {
  completionFor,
  focusDay,
  formatDay,
  gardenForWeek,
  gardenMilestone,
} from "./model";
import { PlantSprite } from "./plant-sprite";
import { SharedCompletionSheet } from "./shared-completion-sheet";
import { ErrorScreen, LoadingScreen, SignedOutLanding, ConsentScreen } from "./state-screens";
import { useWeekData } from "./use-week-data";
import { WeekSelector } from "./week-strip";

export function TogetherScreen() {
  const { state, refresh, giveConsent, setSharedCompletion } = useWeekData(true);
  const [viewMode, setViewMode] = useState<"today" | "week">("today");
  const [participantFilter, setParticipantFilter] = useState<"all" | "waiting">("all");
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
  const selectedWeek = selectedWeekNumber ?? data.activeWeekNumber;
  const visibleWeekNumber = viewMode === "today" && day
    ? day.weekNumber
    : selectedWeek;
  const selectedGarden = gardenForWeek(data, visibleWeekNumber);
  const milestone = gardenMilestone(selectedGarden);
  const percent = Math.round(selectedGarden.progress * 100);
  const selectedParticipant = data.participants.find(
    (participant) => participant.id === selectedParticipantId,
  ) ?? null;
  const orderedParticipants = [...data.participants].sort((left, right) => {
    if (left.id === data.currentUser.id) return -1;
    if (right.id === data.currentUser.id) return 1;
    return data.participants.indexOf(left) - data.participants.indexOf(right);
  });
  const waitingToday = day
    ? orderedParticipants.filter(
        (participant) => !completionFor(data, participant.id, day.id),
      ).length
    : 0;
  const visibleParticipants = participantFilter === "waiting" && day
    ? orderedParticipants.filter(
        (participant) => !completionFor(data, participant.id, day.id),
      )
    : orderedParticipants;

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

      <div className="togetherViewSwitch" role="group" aria-label="함께 현황 보기 방식">
        <button
          type="button"
          className={viewMode === "today" ? "selected" : ""}
          aria-pressed={viewMode === "today"}
          onClick={() => setViewMode("today")}
        >오늘 <span>{completedToday}/{data.participants.length}</span></button>
        <button
          type="button"
          className={viewMode === "week" ? "selected" : ""}
          aria-pressed={viewMode === "week"}
          onClick={() => setViewMode("week")}
        >7일 전체 <span>표로 보기</span></button>
      </div>

      {viewMode === "today" && day ? (
        <section className="todayRollCallSection" aria-labelledby="today-status-title">
          <div className="sectionHeading">
            <div>
              <p className="eyebrow">TODAY AT A GLANCE</p>
              <h2 id="today-status-title">{day.isToday ? "오늘의 함께" : day.isFuture ? "다가오는 첫날" : "가장 가까운 말씀"}</h2>
            </div>
            <span className="countBadge">{formatDay(day.date, { month: "numeric", day: "numeric" })}</span>
          </div>
          <div className="todayRollCallProgress" aria-label={`${data.participants.length}명 중 ${completedToday}명 읽음 완료`}>
            <div><span style={{ width: `${data.participants.length ? Math.round((completedToday / data.participants.length) * 100) : 0}%` }} /></div>
            <p><strong>{completedToday}명</strong>이 함께했어요 <span>· {waitingToday}명 기다리는 중</span></p>
          </div>
          <div className="todayParticipantFilters" role="group" aria-label="참여자 상태 필터">
            <button type="button" className={participantFilter === "all" ? "selected" : ""} aria-pressed={participantFilter === "all"} onClick={() => setParticipantFilter("all")}>모두 {data.participants.length}</button>
            <button type="button" className={participantFilter === "waiting" ? "selected" : ""} aria-pressed={participantFilter === "waiting"} onClick={() => setParticipantFilter("waiting")}>아직 {waitingToday}</button>
          </div>
          <p className="todayStatusHint">이름을 누르면 그 사람의 이번 주 기록을 확인하고 함께 정정할 수 있어요.</p>
          <div className="todayRollCallList" role="list">
            {visibleParticipants.map((participant) => {
              const complete = completionFor(data, participant.id, day.id);
              const isMe = participant.id === data.currentUser.id;
              const status = day.isFuture
                ? "아직 시작 전"
                : complete
                  ? "읽음"
                  : "읽지 않음";
              return (
                <button
                  key={participant.id}
                  type="button"
                  role="listitem"
                  className={`todayParticipantRow ${complete ? "complete" : ""} ${isMe ? "current" : ""}`}
                  aria-label={`${participant.name}${isMe ? ", 나" : ""}, ${status}. 이번 주 기록 확인하기`}
                  onClick={() => openEditor(participant.id)}
                >
                  <span className="todayParticipantAvatar" aria-hidden="true">{day.isFuture ? "🌰" : complete ? "🌼" : "🌱"}</span>
                  <span className="todayParticipantCopy"><strong>{participant.name}{isMe ? <i>나</i> : null}</strong><small>{day.isFuture ? `${formatDay(day.date, { month: "numeric", day: "numeric" })}에 시작해요` : complete ? "오늘의 말씀을 읽었어요" : "아직 오늘 기록이 없어요"}</small></span>
                  <span className="todayParticipantState"><i aria-hidden="true">{day.isFuture ? "🌙" : complete ? "🌼" : "🌿"}</i>{day.isFuture ? "시작 전" : complete ? "꽃피움" : "기다리는 중"}</span>
                  <span className="todayParticipantCue" aria-hidden="true">›</span>
                </button>
              );
            })}
            {visibleParticipants.length === 0 ? <div className="todayEveryoneComplete"><span aria-hidden="true">✦</span><strong>모두 함께했어요!</strong><p>오늘의 정원이 한층 더 풍성해졌어요.</p></div> : null}
          </div>
        </section>
      ) : null}

      {viewMode === "week" ? (
        <>
          <WeekSelector
            data={data}
            selectedWeekNumber={selectedWeek}
            onSelect={setSelectedWeekNumber}
          />
          <section className="communityStats" aria-label="공동체 묵상 통계">
            <div><span>오늘 함께</span><strong>{completedToday}<i>명</i></strong></div>
            <div><span>{visibleWeekNumber}주차 걸음</span><strong>{selectedGarden.completedCount}<i>번</i></strong></div>
            <div><span>{milestone.goalReached ? "보너스 성장" : "완성까지"}</span><strong>{milestone.goalReached ? milestone.bonusCount : Math.max(0, milestone.goal - selectedGarden.completedCount)}<i>걸음</i></strong></div>
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
        </>
      ) : null}

      <section className="growthSummary">
        <div className={`growthRing ${milestone.goalReached ? "complete" : ""}`} style={{ "--progress": `${percent * 3.6}deg` } as React.CSSProperties}>
          <span>{milestone.goalReached && milestone.bonusCount > 0 ? `+${milestone.bonusCount}` : percent}<small>{milestone.goalReached ? milestone.bonusCount > 0 ? "보너스" : "완성" : "%"}</small></span>
        </div>
        <div>
          <p className="eyebrow">WEEK {visibleWeekNumber} · ONE TREE</p>
          <h2>{milestone.goalReached ? `${visibleWeekNumber}주차 정원이\n활짝 완성됐어요` : `${visibleWeekNumber}주차 나무가\n${selectedGarden.stage + 1}단계까지 자랐어요`}</h2>
          <p>{milestone.goalReached
            ? milestone.bonusCount > 0
              ? `${milestone.goal}걸음으로 완성한 뒤에도 ${milestone.bonusCount}걸음이 더해져 보너스 꽃이 피고 있어요.`
              : `${milestone.goal}번의 말씀 걸음이 모여 정원이 활짝 완성됐어요. 이후 걸음은 보너스 꽃으로 이어져요.`
            : `${selectedGarden.remaining}번의 말씀 걸음이 더 모이면 다음 모습으로 자라요.`}</p>
        </div>
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
