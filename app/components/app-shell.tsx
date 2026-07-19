"use client";

import Link from "next/link";
import { ReactNode, useState } from "react";
import { WeekData } from "./model";

type AppShellProps = {
  data: WeekData;
  active: "home" | "together" | "admin";
  children: ReactNode;
  lastUpdated?: Date | null;
  stickyAction?: ReactNode;
};

export function AppShell({ data, active, children, lastUpdated, stickyAction }: AppShellProps) {
  const isAdmin = data.currentUser.role === "admin";
  const [changingParticipant, setChangingParticipant] = useState(false);

  async function changeParticipant() {
    if (changingParticipant) return;
    setChangingParticipant(true);
    try {
      const response = await fetch("/api/session", {
        method: "DELETE",
        credentials: "same-origin",
        headers: { accept: "application/json" },
      });
      if (!response.ok) throw new Error();
      window.location.assign("/");
    } catch {
      setChangingParticipant(false);
      window.alert("이름 선택 화면을 열지 못했어요. 잠시 후 다시 눌러 주세요.");
    }
  }
  return (
    <div className={`appFrame ${stickyAction ? "hasStickyAction" : ""}`}>
      <header className="appHeader">
        <Link className="brandLockup" href="/" aria-label="말씀정원 홈">
          <span className="brandMark" aria-hidden="true">♧</span>
          <span>{data.campaign.title}</span>
        </Link>
        <div className="headerActions">
          <span className="syncDot" title={lastUpdated ? `${lastUpdated.toLocaleTimeString("ko-KR")} 동기화` : "동기화 중"}>
            <span aria-hidden="true" /> 함께 자라는 중
          </span>
          {isAdmin ? <Link className="adminHeaderLink" href="/admin" aria-current={active === "admin" ? "page" : undefined}>관리</Link> : null}
          <button
            className="avatarButton"
            type="button"
            disabled={changingParticipant}
            aria-label={isAdmin ? "관리자 모드 나가기, 참여자 이름 고르기" : `현재 ${data.currentUser.name}님, 이름 바꾸기`}
            title={isAdmin ? "참여자 화면으로 전환" : "이름 바꾸기"}
            onClick={() => void changeParticipant()}
          >
            {changingParticipant ? "…" : data.currentUser.name.slice(0, 1)}
          </button>
        </div>
      </header>
      <main className="appMain">{children}</main>
      {stickyAction ? <div className="stickyAction"><div>{stickyAction}</div></div> : null}
      <nav className="bottomNav" aria-label="주요 메뉴">
        <Link href="/" className={active === "home" ? "active" : ""} aria-current={active === "home" ? "page" : undefined}>
          <span aria-hidden="true">⌂</span><strong>오늘</strong>
        </Link>
        <Link href="/together" className={active === "together" ? "active" : ""} aria-current={active === "together" ? "page" : undefined}>
          <span aria-hidden="true">♧</span><strong>함께</strong>
        </Link>
      </nav>
    </div>
  );
}

export function InlineNotice({ children }: { children: ReactNode }) {
  return <p className="inlineNotice" role="status"><span aria-hidden="true">!</span>{children}</p>;
}
