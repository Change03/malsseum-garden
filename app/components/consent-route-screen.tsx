"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { focusDay } from "./model";
import { ConsentScreen, ErrorScreen, LoadingScreen, SignedOutLanding } from "./state-screens";
import { useWeekData } from "./use-week-data";

export function ConsentRouteScreen() {
  const router = useRouter();
  const { state, refresh, giveConsent } = useWeekData(false);
  const readyTarget = state.data ? focusDay(state.data)?.date : null;

  useEffect(() => {
    if (state.status === "ready") router.replace(`/day/${encodeURIComponent(readyTarget ?? "2026-07-27")}`);
  }, [readyTarget, router, state.status]);

  if (state.status === "signed-out") return <SignedOutLanding />;
  if (state.status === "error") return <ErrorScreen message={state.message} onRetry={() => void refresh(false)} />;
  if (state.status === "consent") {
    return (
      <ConsentScreen
        name={state.consent?.name ?? "참여자"}
        onConsent={async () => {
          await giveConsent();
          router.replace("/day/2026-07-27");
        }}
      />
    );
  }
  return <LoadingScreen />;
}
