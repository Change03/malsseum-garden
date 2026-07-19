import { NextResponse } from "next/server";
import {
  getViewer,
  listGroupParticipants,
  selectGroupParticipant,
} from "@/lib/server/auth";
import {
  MEMBER_COOKIE_NAME,
  POLL_AFTER_MS,
  SESSION_COOKIE_NAME,
  SESSION_EXPIRES_AT,
} from "@/lib/server/constants";
import {
  ApiError,
  errorResponse,
  isSameOriginMutation,
  json,
  readJson,
} from "@/lib/server/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const viewer = await getViewer(request);
    if (!viewer) {
      return json({
        authenticated: false,
        participants: await listGroupParticipants(),
        pollAfterMs: POLL_AFTER_MS,
      });
    }
    return json({
      authenticated: true,
      viewer,
      needsConsent: viewer.role === "member" && !viewer.consentedAt,
      pollAfterMs: POLL_AFTER_MS,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    const payload = await readJson(request);
    if (!isParticipantSelection(payload)) {
      throw new ApiError(400, "INVALID_PARTICIPANT", "내 이름을 다시 선택해 주세요.");
    }
    const selection = await selectGroupParticipant(payload.participantId);
    if (!selection) {
      throw new ApiError(404, "PARTICIPANT_NOT_FOUND", "참여자를 찾을 수 없습니다.");
    }

    const response = NextResponse.json({
      selected: true,
      viewer: selection.viewer,
      needsConsent: !selection.viewer.consentedAt,
      redirectPath: selection.viewer.consentedAt ? "/" : "/consent",
    });
    response.headers.set("Cache-Control", "no-store, private");
    setMemberCookie(response, request, selection.cookieValue);
    clearCookie(response, request, SESSION_COOKIE_NAME);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

export async function DELETE(request: Request) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    const response = NextResponse.json({ selected: false });
    response.headers.set("Cache-Control", "no-store, private");
    clearCookie(response, request, MEMBER_COOKIE_NAME);
    clearCookie(response, request, SESSION_COOKIE_NAME);
    return response;
  } catch (error) {
    return errorResponse(error);
  }
}

function isParticipantSelection(
  value: unknown,
): value is { participantId: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "participantId" in value &&
    typeof value.participantId === "string" &&
    /^[A-Za-z0-9_-]{1,64}$/u.test(value.participantId)
  );
}

function setMemberCookie(
  response: NextResponse,
  request: Request,
  participantId: string,
) {
  response.cookies.set(MEMBER_COOKIE_NAME, participantId, {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    expires: new Date(SESSION_EXPIRES_AT),
  });
}

function clearCookie(
  response: NextResponse,
  request: Request,
  name: string,
) {
  response.cookies.set(name, "", {
    httpOnly: true,
    secure: new URL(request.url).protocol === "https:",
    sameSite: "lax",
    path: "/",
    expires: new Date(0),
    maxAge: 0,
  });
}
