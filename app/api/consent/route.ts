import { eq } from "drizzle-orm";
import { getDb } from "@/db";
import { participants } from "@/db/schema";
import { requireMember } from "@/lib/server/auth";
import {
  ApiError,
  errorResponse,
  isSameOriginMutation,
  json,
  readJson,
} from "@/lib/server/response";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    const viewer = await requireMember(request, false);
    const payload = await readJson(request);
    if (!isConsentPayload(payload) || payload.accepted !== true) {
      throw new ApiError(400, "CONSENT_REQUIRED", "동의 확인이 필요합니다.");
    }

    const consentedAt = new Date().toISOString();
    await getDb()
      .update(participants)
      .set({ consentedAt })
      .where(eq(participants.id, viewer.participantId));

    return json({
      consent: { accepted: true, consentedAt },
      viewer: { ...viewer, consentedAt },
    });
  } catch (error) {
    return errorResponse(error);
  }
}

function isConsentPayload(value: unknown): value is { accepted: boolean } {
  return (
    typeof value === "object" &&
    value !== null &&
    "accepted" in value &&
    typeof value.accepted === "boolean"
  );
}
