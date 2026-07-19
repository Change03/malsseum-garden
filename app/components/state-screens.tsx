"use client";

import { FormEvent, useEffect, useState } from "react";

type GroupParticipant = {
  id: string;
  name: string;
  sortOrder: number;
};

export function LoadingScreen() {
  return (
    <main className="statePage" aria-busy="true" aria-live="polite">
      <div className="brandMark" aria-hidden="true">♧</div>
      <div className="loadingSprout" aria-hidden="true"><span /></div>
      <p className="eyebrow">말씀정원</p>
      <h1>우리의 두 주를<br />가꾸고 있어요</h1>
      <p className="stateCopy">잠시만 기다려 주세요.</p>
    </main>
  );
}

export function SignedOutLanding() {
  const [participants, setParticipants] = useState<GroupParticipant[]>([]);
  const [loadingParticipants, setLoadingParticipants] = useState(true);
  const [rosterError, setRosterError] = useState(false);
  const [selectingId, setSelectingId] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadParticipants() {
      try {
        const response = await fetch("/api/session", {
          cache: "no-store",
          credentials: "same-origin",
          headers: { accept: "application/json" },
          signal: controller.signal,
        });
        const payload = await response.json().catch(() => null) as {
          participants?: unknown;
        } | null;
        if (!response.ok || !Array.isArray(payload?.participants)) {
          throw new Error("이름 목록을 불러오지 못했어요.");
        }
        const roster = payload.participants.filter(isGroupParticipant);
        setParticipants(roster);
        setRosterError(false);
        if (roster.length === 0) {
          setMessage("운영 기간이 끝나 참여자 이름을 정리했어요.");
        }
      } catch (error) {
        if (controller.signal.aborted) return;
        setRosterError(true);
        setMessage(error instanceof Error ? error.message : "잠시 후 다시 열어 주세요.");
      } finally {
        if (!controller.signal.aborted) setLoadingParticipants(false);
      }
    }
    void loadParticipants();
    return () => controller.abort();
  }, []);

  async function selectParticipant(participantId: string) {
    if (selectingId) return;
    setSelectingId(participantId);
    setMessage("");
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        credentials: "same-origin",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ participantId }),
      });
      const payload = await response.json().catch(() => null) as {
        error?: { message?: string };
        redirectPath?: string;
      } | null;
      if (!response.ok) {
        throw new Error(payload?.error?.message || "이름을 선택하지 못했어요.");
      }
      window.location.assign(payload?.redirectPath === "/consent" ? "/consent" : "/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 눌러 주세요.");
      setSelectingId("");
    }
  }

  return (
    <main className="landingPage">
      <div className="landingGlow landingGlowOne" />
      <div className="landingGlow landingGlowTwo" />
      <header className="landingHeader">
        <div className="brandLockup">
          <span className="brandMark" aria-hidden="true">♧</span>
          <span>말씀정원</span>
        </div>
        <span className="privacyPill"><span aria-hidden="true">●</span> 단톡방 공용</span>
      </header>
      <section className="landingHero">
        <p className="eyebrow">JUL 27 – AUG 09 · TWO GARDENS</p>
        <h1>한 링크로 모여<br /><em>함께 가꾸는 정원</em></h1>
        <p>
          7월 27일부터 8월 9일까지 이 주소로 들어와<br />
          내 이름을 고르면 두 주 묵상을 시작할 수 있어요.
        </p>
      </section>
      <section className="groupEntryCard" aria-labelledby="group-entry-title">
        <div className="groupEntryHeading">
          <div><p className="eyebrow">WHO ARE YOU?</p><h2 id="group-entry-title">내 이름을 골라 주세요</h2></div>
          <span>{loadingParticipants ? "불러오는 중" : `${participants.length}명`}</span>
        </div>
        <p className="groupEntryIntro">선택한 이름이 ‘나의 기록’ 기준이 돼요. 본인 이름을 한 번만 눌러 주세요.</p>
        <div className="groupNameGrid" role="group" aria-label="참여자 이름 선택" aria-busy={Boolean(selectingId)}>
          {participants.map((participant) => (
            <button
              key={participant.id}
              type="button"
              disabled={Boolean(selectingId)}
              aria-label={`${participant.name}으로 시작하기`}
              onClick={() => void selectParticipant(participant.id)}
            >
              <span aria-hidden="true">{participant.name.slice(0, 1)}</span>
              <strong>{participant.name}</strong>
              <i aria-hidden="true">{selectingId === participant.id ? "…" : "›"}</i>
            </button>
          ))}
        </div>
        {loadingParticipants ? <p className="groupEntryMessage" role="status">함께할 이름을 불러오는 중이에요…</p> : null}
        {selectingId ? <p className="groupEntryMessage" role="status">정원을 여는 중이에요…</p> : null}
        {message ? <p className="groupEntryMessage errorText" role="alert">{message}</p> : null}
        {rosterError ? (
          <button className="groupRosterRetry" type="button" onClick={() => window.location.reload()}>
            이름 목록 다시 불러오기
          </button>
        ) : null}
        <p className="groupEntryPolicy"><span aria-hidden="true">↗</span> 모임 사람 모두가 13명의 체크를 보고 함께 수정할 수 있어요.</p>
      </section>
      <div className="landingPlant" aria-hidden="true">
        <span className="landingLeaf landingLeafOne" />
        <span className="landingLeaf landingLeafTwo" />
        <span className="landingStem" />
        <span className="landingSoil" />
      </div>
      <section className="landingPromise" aria-label="서비스 특징">
        <div><span aria-hidden="true">01</span><p><strong>공식 본문으로</strong>안전하게 읽어요</p></div>
        <div><span aria-hidden="true">02</span><p><strong>매주 씨앗부터</strong>새 정원을 함께 키워요</p></div>
        <div><span aria-hidden="true">03</span><p><strong>마음에 남은 말씀은</strong>현재 화면에서만 간직해요</p></div>
      </section>
      <p className="landingFinePrint">공용 링크를 아는 사람은 이름과 읽음 기록을 볼 수 있습니다. 단톡방 안에서만 공유해 주세요.</p>
    </main>
  );
}

function isGroupParticipant(value: unknown): value is GroupParticipant {
  if (!value || typeof value !== "object") return false;
  const source = value as Record<string, unknown>;
  return (
    typeof source.id === "string" &&
    typeof source.name === "string" &&
    typeof source.sortOrder === "number"
  );
}

type ConsentScreenProps = {
  name: string;
  onConsent: () => Promise<void>;
};

export function ConsentScreen({ name, onConsent }: ConsentScreenProps) {
  const [checked, setChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [changingParticipant, setChangingParticipant] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!checked || submitting) return;
    setSubmitting(true);
    setMessage("");
    try {
      await onConsent();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "동의를 저장하지 못했어요.");
      setSubmitting(false);
    }
  }

  async function changeParticipant() {
    if (submitting || changingParticipant) return;
    setChangingParticipant(true);
    setMessage("");
    try {
      const response = await fetch("/api/session", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error("이름 선택 화면을 열지 못했어요.");
      window.location.assign("/");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "잠시 후 다시 눌러 주세요.");
      setChangingParticipant(false);
    }
  }

  return (
    <main className="consentPage">
      <header className="consentHeader">
        <div className="brandLockup">
          <span className="brandMark" aria-hidden="true">♧</span>
          <span>말씀정원</span>
        </div>
        <span className="privacyPill"><span aria-hidden="true">●</span> 우리 모임</span>
      </header>
      <section className="consentCard">
        <p className="eyebrow">처음 한 번만 확인해 주세요</p>
        <h1>{name}님,<br />함께 걸어도 될까요?</h1>
        <p className="consentIntro">서로 안심하고 묵상할 수 있도록 기록이 어떻게 쓰이는지 알려드려요.</p>
        <ul className="consentList">
          <li><span aria-hidden="true">✓</span><div><strong>이름과 읽음 여부</strong><p>공용 링크로 들어온 모임 사람끼리 보고 서로의 체크를 정정할 수 있어요.</p></div></li>
          <li><span aria-hidden="true">✓</span><div><strong>마음에 남은 말씀</strong><p>저장하거나 전송하지 않고 현재 화면 메모리에만 두어요.</p></div></li>
          <li><span aria-hidden="true">✓</span><div><strong>성경 본문과 해설</strong><p>저작권을 존중해 공식 제공 페이지에서 열어요.</p></div></li>
        </ul>
        <p className="guardianNote"><span aria-hidden="true">ⓘ</span> 만 14세 미만 참여자는 보호자와 함께 내용을 확인하고 보호자 동의를 받아 주세요.</p>
        <form onSubmit={submit}>
          <label className="consentCheck">
            <input type="checkbox" checked={checked} onChange={(event) => setChecked(event.target.checked)} />
            <span aria-hidden="true" />
            <strong>위 내용을 이해했고 참여에 동의해요.</strong>
          </label>
          {message ? <p className="formMessage errorText" role="alert">{message}</p> : null}
          <button className="primaryButton" type="submit" disabled={!checked || submitting || changingParticipant}>
            {submitting ? "참여를 준비하는 중…" : "동의하고 시작하기"}
          </button>
          <button className="textButton consentChangeButton" type="button" disabled={submitting || changingParticipant} onClick={() => void changeParticipant()}>
            {changingParticipant ? "이름 선택 화면을 여는 중…" : "이 이름이 아닌가요? 다시 선택"}
          </button>
        </form>
      </section>
      <p className="consentFinePrint">참여 중단이나 기록 삭제는 운영자에게 요청할 수 있어요.</p>
    </main>
  );
}

type ErrorScreenProps = {
  message: string;
  onRetry: () => void;
};

export function ErrorScreen({ message, onRetry }: ErrorScreenProps) {
  return (
    <main className="statePage">
      <div className="brandMark" aria-hidden="true">♧</div>
      <div className="stateIcon" aria-hidden="true">!</div>
      <p className="eyebrow">잠시 연결이 고르지 않아요</p>
      <h1>기록을 불러오지<br />못했어요</h1>
      <p className="stateCopy">{message}</p>
      <button type="button" className="primaryButton compactButton" onClick={onRetry}>다시 불러오기</button>
    </main>
  );
}
