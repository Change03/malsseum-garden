"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { completionFor, normalizeWeek, WeekData, withCompletion } from "./model";

type ConsentState = {
  required: boolean;
  name: string;
};

export type WeekLoadState = {
  status: "loading" | "ready" | "signed-out" | "consent" | "error";
  data: WeekData | null;
  consent: ConsentState | null;
  message: string;
  lastUpdated: Date | null;
};

export function useWeekData(poll = true) {
  const [state, setState] = useState<WeekLoadState>({
    status: "loading",
    data: null,
    consent: null,
    message: "",
    lastUpdated: null,
  });
  const activeRequest = useRef<AbortController | null>(null);

  const refresh = useCallback(async (silent = false) => {
    activeRequest.current?.abort();
    const controller = new AbortController();
    activeRequest.current = controller;
    if (!silent) {
      setState((current) => ({ ...current, status: current.data ? "ready" : "loading", message: "" }));
    }
    try {
      const response = await fetch("/api/week", {
        cache: "no-store",
        credentials: "same-origin",
        headers: { accept: "application/json" },
        signal: controller.signal,
      });
      const payload = await readJson(response);
      if (response.status === 401) {
        setState({ status: "signed-out", data: null, consent: null, message: "", lastUpdated: null });
        return;
      }
      if (response.status === 403 && isConsentPayload(payload)) {
        setState({
          status: "consent",
          data: null,
          consent: { required: true, name: typeof payload.name === "string" ? payload.name : "참여자" },
          message: "",
          lastUpdated: null,
        });
        return;
      }
      if (!response.ok) {
        throw new Error(apiMessage(payload, "주간 기록을 불러오지 못했어요."));
      }
      setState({
        status: "ready",
        data: normalizeWeek(payload),
        consent: null,
        message: "",
        lastUpdated: new Date(),
      });
    } catch (error) {
      if (controller.signal.aborted) return;
      setState((current) => ({
        ...current,
        status: current.data ? "ready" : "error",
        message: error instanceof Error ? error.message : "잠시 후 다시 시도해 주세요.",
      }));
    }
  }, []);

  useEffect(() => {
    void refresh(false);
    return () => activeRequest.current?.abort();
  }, [refresh]);

  useEffect(() => {
    if (!poll || state.status !== "ready") return;
    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refresh(true);
    }, 15_000);
    return () => window.clearInterval(interval);
  }, [poll, refresh, state.status]);

  const giveConsent = useCallback(async () => {
    const response = await fetch("/api/consent", {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify({ accepted: true }),
    });
    const payload = await readJson(response);
    if (!response.ok) throw new Error(apiMessage(payload, "동의를 저장하지 못했어요."));
    await refresh(false);
  }, [refresh]);

  const saveCompletion = useCallback(async (
    participantId: string,
    dayId: string,
    completed: boolean,
    endpoint: string,
  ) => {
    const before = state.data;
    if (!before) return;
    const previous = completionFor(before, participantId, dayId);
    setState((current) => current.data
      ? { ...current, data: withCompletion(current.data, participantId, dayId, completed), message: "" }
      : current);
    try {
      const response = await fetch(endpoint, {
        method: "PUT",
        credentials: "same-origin",
        headers: { "content-type": "application/json", accept: "application/json" },
        body: JSON.stringify({ completed }),
      });
      const payload = await readJson(response);
      if (!response.ok) throw new Error(apiMessage(payload, "읽음 표시를 저장하지 못했어요."));
      void refresh(true);
    } catch (error) {
      setState((current) => ({
        ...current,
        data: current.data
          ? withCompletion(current.data, participantId, dayId, previous)
          : current.data,
        message: error instanceof Error ? error.message : "읽음 표시를 저장하지 못했어요.",
      }));
      throw error;
    }
  }, [refresh, state.data]);

  const setMyCompletion = useCallback(async (dayId: string, completed: boolean) => {
    const participantId = state.data?.currentUser.id;
    if (!participantId) return;
    await saveCompletion(
      participantId,
      dayId,
      completed,
      `/api/completions/${encodeURIComponent(dayId)}`,
    );
  }, [saveCompletion, state.data?.currentUser.id]);

  const setSharedCompletion = useCallback(async (
    participantId: string,
    dayId: string,
    completed: boolean,
  ) => {
    await saveCompletion(
      participantId,
      dayId,
      completed,
      `/api/completions/shared/${encodeURIComponent(participantId)}/${encodeURIComponent(dayId)}`,
    );
  }, [saveCompletion]);

  return {
    state,
    refresh,
    giveConsent,
    setMyCompletion,
    setSharedCompletion,
    setState,
  };
}

export async function readJson(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return null;
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function apiMessage(payload: unknown, fallback: string): string {
  if (payload && typeof payload === "object") {
    const source = payload as Record<string, unknown>;
    for (const key of ["message", "error", "detail"]) {
      if (typeof source[key] === "string" && source[key]) return source[key];
      if (source[key] && typeof source[key] === "object") {
        const nested = source[key] as Record<string, unknown>;
        if (typeof nested.message === "string" && nested.message) return nested.message;
      }
    }
  }
  return fallback;
}

function isConsentPayload(payload: unknown): payload is { consentRequired: true; name?: string } {
  return Boolean(
    payload &&
    typeof payload === "object" &&
    (payload as Record<string, unknown>).consentRequired === true,
  );
}
