"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { AppShell, InlineNotice } from "./app-shell";
import { CompletionMatrix } from "./completion-matrix";
import {
  gardenForWeek,
  normalizeWeek,
  WeekData,
  withCompletion,
} from "./model";
import { ErrorScreen, LoadingScreen, ConsentScreen } from "./state-screens";
import { apiMessage, readJson, useWeekData } from "./use-week-data";
import { WeekSelector } from "./week-strip";

type AdminTab = "records" | "link" | "content";

export function AdminScreen() {
  const { state, refresh, giveConsent } = useWeekData(true);
  const [tab, setTab] = useState<AdminTab>("records");
  const [overview, setOverview] = useState<WeekData | null>(null);
  const [busyKey, setBusyKey] = useState("");
  const [status, setStatus] = useState("");
  const [statusError, setStatusError] = useState(false);
  const [selectedWeekNumber, setSelectedWeekNumber] = useState<number | null>(null);

  useEffect(() => {
    if (state.status !== "ready" || state.data?.currentUser.role !== "admin") return;
    let cancelled = false;
    async function loadOverview() {
      try {
        const response = await fetch("/api/admin/overview", {
          cache: "no-store",
          credentials: "same-origin",
          headers: { accept: "application/json" },
        });
        if (response.status === 404) return;
        const payload = await readJson(response);
        if (!response.ok) return;
        if (!cancelled && payload && typeof payload === "object") {
          const source = payload as Record<string, unknown>;
          setOverview(normalizeWeek(source.week ?? payload));
        }
      } catch {
        return;
      }
    }
    void loadOverview();
    return () => { cancelled = true; };
  }, [state.data, state.status]);

  if (state.status === "loading") return <LoadingScreen />;
  if (state.status === "signed-out") return <AdminSignedOutScreen />;
  if (state.status === "consent") return <ConsentScreen name={state.consent?.name ?? "참여자"} onConsent={giveConsent} />;
  if (state.status === "error" || !state.data) return <ErrorScreen message={state.message} onRetry={() => void refresh(false)} />;

  const data = overview ?? state.data;
  if (state.data.currentUser.role !== "admin") {
    return (
      <AppShell data={state.data} active="home" lastUpdated={state.lastUpdated}>
        <section className="notFoundCard"><span aria-hidden="true">⌁</span><h1>운영자 전용 화면이에요</h1><p>주간 기록은 ‘함께’ 메뉴에서 볼 수 있어요.</p><a className="primaryButton" href="/together">함께 보기</a></section>
      </AppShell>
    );
  }
  const visibleWeekNumber = selectedWeekNumber ?? data.activeWeekNumber;
  const visibleGarden = gardenForWeek(data, visibleWeekNumber);

  async function toggleAdminCompletion(participantId: string, dayId: string, completed: boolean) {
    const before = data;
    const key = `${participantId}:${dayId}`;
    setBusyKey(key);
    setOverview(withCompletion(data, participantId, dayId, completed));
    setStatus("");
    try {
      const response = await fetch(`/api/admin/completions/${encodeURIComponent(participantId)}/${encodeURIComponent(dayId)}`, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ completed }),
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(apiMessage(payload, "기록을 수정하지 못했어요."));
      setStatusError(false);
      setStatus("읽음 기록을 수정했어요.");
      await refresh(true);
      setOverview(null);
    } catch (error) {
      setOverview(before);
      setStatusError(true);
      setStatus(error instanceof Error ? error.message : "기록을 수정하지 못했어요.");
    } finally {
      setBusyKey("");
    }
  }

  return (
    <AppShell data={state.data} active="admin" lastUpdated={state.lastUpdated}>
      {state.message ? <InlineNotice>{state.message}</InlineNotice> : null}
      <section className="adminHero">
        <div><p className="eyebrow">GARDEN KEEPER</p><h1>두 주를<br /><em>정성껏 돌봐요</em></h1><p>기록 수정, 단톡방 공용 링크, 공식 콘텐츠 연결을 한곳에서 관리해요.</p></div>
        <div className="adminSeal" aria-hidden="true"><span>♧</span><small>ADMIN</small></div>
      </section>

      <section className="adminStats" aria-label="운영 현황">
        <div><span>참여자</span><strong>{data.participants.length}<i>명</i></strong></div>
        <div><span>{visibleWeekNumber}주차 기록</span><strong>{visibleGarden.completedCount}<i>개</i></strong></div>
        <div><span>성장 단계</span><strong>{visibleGarden.stage + 1}<i>/9</i></strong></div>
      </section>

      <div className="adminTabs" aria-label="관리 메뉴">
        <button type="button" aria-pressed={tab === "records"} className={tab === "records" ? "active" : ""} onClick={() => setTab("records")}>읽음 기록</button>
        <button type="button" aria-pressed={tab === "link"} className={tab === "link" ? "active" : ""} onClick={() => setTab("link")}>공유 링크</button>
        <button type="button" aria-pressed={tab === "content"} className={tab === "content" ? "active" : ""} onClick={() => setTab("content")}>콘텐츠 연결</button>
      </div>

      {status ? <p className={`adminStatus ${statusError ? "errorText" : ""}`} role="status">{status}</p> : null}

      {tab === "records" ? (
        <section className="adminPanel" aria-labelledby="admin-records-title">
          <div className="sectionHeading"><div><p className="eyebrow">CHECKLIST CONTROL</p><h2 id="admin-records-title">읽음 기록 관리</h2></div><span className="sourceBadge">직접 수정</span></div>
          <p className="sectionDescription">오입력이나 요청이 있을 때만 체크를 눌러 수정해 주세요. 변경은 바로 공동 체크표에 반영돼요.</p>
          <WeekSelector
            data={data}
            selectedWeekNumber={visibleWeekNumber}
            onSelect={setSelectedWeekNumber}
          />
          <CompletionMatrix
            data={data}
            weekNumber={visibleWeekNumber}
            editable
            busyKey={busyKey}
            onToggle={toggleAdminCompletion}
          />
        </section>
      ) : null}

      {tab === "link" ? <GroupLinkPanel onStatus={(message, error) => { setStatus(message); setStatusError(error); }} /> : null}
      {tab === "content" ? <ContentImportPanel data={data} onImported={() => void refresh(true)} onStatus={(message, error) => { setStatus(message); setStatusError(error); }} /> : null}

      <p className="privacyFooter"><span aria-hidden="true">●</span> 운영 작업은 관리자 권한으로 기록됩니다.</p>
    </AppShell>
  );
}

function AdminSignedOutScreen() {
  return (
    <main className="statePage">
      <div className="brandMark" aria-hidden="true">♧</div>
      <div className="stateIcon" aria-hidden="true">⌁</div>
      <p className="eyebrow">GARDEN KEEPER</p>
      <h1>관리자 링크로<br />접속해 주세요</h1>
      <p className="stateCopy">관리자 주소는 단톡방 공용 링크와 따로 보관해요.</p>
      <Link className="primaryButton compactButton" href="/">공용 사이트로 돌아가기</Link>
    </main>
  );
}

function GroupLinkPanel({
  onStatus,
}: {
  onStatus: (message: string, error: boolean) => void;
}) {
  const [groupLink, setGroupLink] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => setGroupLink(window.location.origin), 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(groupLink);
      onStatus("단톡방 공용 링크를 복사했어요.", false);
    } catch {
      onStatus("주소를 길게 눌러 직접 복사해 주세요.", true);
    }
  }

  async function share() {
    if (!navigator.share) {
      await copy();
      return;
    }
    try {
      await navigator.share({
        title: "말씀정원",
        text: "말씀정원에서 내 이름을 고르고 함께 시작해요.",
        url: groupLink,
      });
      onStatus("공유할 앱을 열었어요.", false);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      onStatus("공유 창을 열지 못했어요. 링크 복사를 이용해 주세요.", true);
    }
  }

  return (
    <section className="adminPanel" aria-labelledby="admin-group-link-title">
      <div className="sectionHeading"><div><p className="eyebrow">ONE LINK · ONE GARDEN</p><h2 id="admin-group-link-title">단톡방 공유 링크</h2></div><span className="privacyPill"><span aria-hidden="true">●</span> 하나로 함께</span></div>
      <p className="sectionDescription">아래 주소 하나만 단톡방에 올려 주세요. 처음 들어온 사람은 자기 이름을 고르고, 그다음부터 같은 기기에서 바로 정원으로 들어와요.</p>
      <div className="groupLinkBox">
        <label htmlFor="group-site-link">공용 사이트 주소</label>
        <input id="group-site-link" type="url" readOnly value={groupLink} onFocus={(event) => event.currentTarget.select()} />
        <div>
          <button className="secondaryButton" type="button" disabled={!groupLink} onClick={() => void copy()}>링크 복사</button>
          <button className="primaryButton" type="button" disabled={!groupLink} onClick={() => void share()}>공유하기</button>
        </div>
      </div>
      <p className="groupLinkNotice"><span aria-hidden="true">ⓘ</span> 이 링크를 받은 사람은 13명의 이름과 체크를 보고 수정할 수 있어요. 단톡방 안에서만 공유해 주세요.</p>
    </section>
  );
}

function ContentImportPanel({
  data,
  onImported,
  onStatus,
}: {
  data: WeekData;
  onImported: () => void;
  onStatus: (message: string, error: boolean) => void;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [preset, setPreset] = useState("daily-bible");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const selected = contentPresets.find((item) => item.id === String(form.get("preset") ?? "")) ?? contentPresets[0];
    const variant = {
      dayId: String(form.get("dayId") ?? ""),
      kind: selected.kind,
      variantKey: selected.variantKey,
      label: selected.label,
      mode: "external",
      sourceName: String(form.get("sourceName") ?? ""),
      sourceUrl: String(form.get("sourceUrl") ?? ""),
      ...(selected.kind === "bible" ? { translationKey: selected.translationKey } : { commentaryKey: selected.commentaryKey }),
      ...(selected.translationKey && selected.kind === "commentary" ? { translationKey: selected.translationKey } : {}),
    };
    setSubmitting(true);
    onStatus("", false);
    try {
      const response = await fetch("/api/admin/content/import", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ variants: [variant] }),
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(apiMessage(payload, response.status === 404 ? "콘텐츠 연결 기능이 아직 준비 중이에요." : "공식 링크를 저장하지 못했어요."));
      const source = payload && typeof payload === "object" ? payload as Record<string, unknown> : {};
      onStatus(`${typeof source.imported === "number" ? source.imported : 1}개의 공식 링크를 저장했어요.`, false);
      onImported();
    } catch (error) {
      onStatus(error instanceof Error ? error.message : "공식 링크를 저장하지 못했어요.", true);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="adminPanel" aria-labelledby="admin-content-title">
      <div className="sectionHeading"><div><p className="eyebrow">OFFICIAL SOURCES</p><h2 id="admin-content-title">공식 콘텐츠 연결</h2></div><span className="sourceBadge"><span aria-hidden="true">↗</span> 외부 링크</span></div>
      <p className="sectionDescription">본문이나 해설을 붙여넣지 않고, 사용 허가된 공식 페이지 주소만 연결합니다.</p>
      <form className="adminForm" onSubmit={submit}>
        <label><span>날짜</span><select name="dayId" required>{data.days.map((day) => <option key={day.id} value={day.id}>DAY {day.order} · {day.passage}</option>)}</select></label>
        <label><span>콘텐츠 종류</span><select name="preset" required value={preset} onChange={(event) => setPreset(event.target.value)}>{contentPresets.map((item) => <option key={item.id} value={item.id}>{item.kind === "bible" ? "본문" : "해설"} · {item.label}</option>)}</select></label>
        <label><span>공식 출처명</span><input name="sourceName" required maxLength={100} defaultValue={preset.startsWith("daily") ? "성서유니온" : contentPresets.find((item) => item.id === preset)?.label} /></label>
        <label><span>공식 페이지 주소</span><input name="sourceUrl" required type="url" inputMode="url" placeholder="https://" /></label>
        <div className="copyrightNote"><span aria-hidden="true">ⓘ</span><p><strong>전문 수집은 하지 않아요.</strong><br />권리자가 승인한 주소인지 확인한 뒤 저장해 주세요.</p></div>
        <button className="primaryButton" type="submit" disabled={submitting}>{submitting ? "저장하는 중…" : "공식 링크 저장하기"}</button>
      </form>
    </section>
  );
}

const contentPresets = [
  { id: "daily-bible", kind: "commentary", variantKey: "daily-bible", label: "매일성경", commentaryKey: "매일성경", translationKey: null },
  { id: "daily-pure", kind: "commentary", variantKey: "daily-pure", label: "매일성경 순", commentaryKey: "매일성경 순", translationKey: "새번역" },
  { id: "easy-bible", kind: "bible", variantKey: "easy-bible", label: "쉬운성경", translationKey: "쉬운성경", commentaryKey: null },
  { id: "new-translation", kind: "bible", variantKey: "new-translation", label: "새번역", translationKey: "새번역", commentaryKey: null },
  { id: "revised-korean", kind: "bible", variantKey: "revised-korean", label: "개역개정", translationKey: "개역개정", commentaryKey: null },
] as const;
