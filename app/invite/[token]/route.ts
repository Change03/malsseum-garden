import { NextRequest, NextResponse } from "next/server";
import { exchangeInviteToken } from "@/lib/server/auth";
import {
  CAMPAIGN_END_DATE,
  CAMPAIGN_START_DATE,
  SESSION_COOKIE_NAME,
} from "@/lib/server/constants";
import { toKstDate } from "@/lib/server/time";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> },
) {
  const { token } = await params;
  const result = /^[A-Za-z0-9_-]{40,128}$/u.test(token)
    ? await exchangeInviteToken(token)
    : null;

  if (!result) {
    const invalidResponse = NextResponse.redirect(
      new URL("/?invite=invalid", request.url),
      303,
    );
    invalidResponse.headers.set("Cache-Control", "no-store, private");
    invalidResponse.headers.set("Referrer-Policy", "no-referrer");
    return invalidResponse;
  }

  const today = toKstDate();
  const selectedDate =
    today < CAMPAIGN_START_DATE
      ? CAMPAIGN_START_DATE
      : today > CAMPAIGN_END_DATE
        ? CAMPAIGN_END_DATE
        : today;
  const redirectPath =
    result.viewer.role === "member" && result.viewer.consentedAt
      ? `/day/${selectedDate}`
      : result.redirectPath;
  const response = NextResponse.redirect(new URL(redirectPath, request.url), 303);
  response.headers.set("Cache-Control", "no-store, private");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.set(SESSION_COOKIE_NAME, result.sessionToken, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    expires: new Date("2026-09-09T00:00:00+09:00"),
  });
  return response;
}
