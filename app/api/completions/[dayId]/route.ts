import { and, eq } from "drizzle-orm";
import { getDb } from "@/db";
import { completions, devotionalDays } from "@/db/schema";
import { getCompletionEligibility } from "@/lib/domain/campaign-clock";
import { requireMember } from "@/lib/server/auth";
import { CAMPAIGN_ID, POLL_AFTER_MS } from "@/lib/server/constants";
import {
  ApiError,
  errorResponse,
  isSameOriginMutation,
  json,
  readJson,
} from "@/lib/server/response";

export const dynamic = "force-dynamic";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ dayId: string }> },
) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    const viewer = await requireMember(request);
    const payload = await readJson(request);
    if (!isCompletionPayload(payload)) {
      throw new ApiError(
        400,
        "INVALID_COMPLETION",
        "completed 값은 true 또는 false여야 합니다.",
      );
    }
    const { dayId } = await params;
    const db = getDb();
    const [day] = await db
      .select({ id: devotionalDays.id, date: devotionalDays.date })
      .from(devotionalDays)
      .where(
        and(
          eq(devotionalDays.id, dayId),
          eq(devotionalDays.campaignId, CAMPAIGN_ID),
        ),
      )
      .limit(1);

    if (!day) {
      throw new ApiError(404, "DAY_NOT_FOUND", "묵상 날짜를 찾을 수 없습니다.");
    }

    const eligibility = getCompletionEligibility(day.date);
    if (!eligibility.allowed) {
      throw new ApiError(
        423,
        "DAY_LOCKED",
        eligibility.reason === "futureDay"
          ? "미래 날짜는 아직 체크할 수 없습니다."
          : "현재는 읽음 기록을 변경할 수 없습니다.",
      );
    }

    const now = new Date().toISOString();
    await db
      .insert(completions)
      .values({
        participantId: viewer.participantId,
        dayId: day.id,
        completed: payload.completed,
        completedAt: payload.completed ? now : null,
        updatedAt: now,
        updatedByRole: "member",
        updatedById: viewer.participantId,
      })
      .onConflictDoUpdate({
        target: [completions.participantId, completions.dayId],
        set: {
          completed: payload.completed,
          completedAt: payload.completed ? now : null,
          updatedAt: now,
          updatedByRole: "member",
          updatedById: viewer.participantId,
        },
      });

    return json({
      completion: {
        participantId: viewer.participantId,
        dayId: day.id,
        completed: payload.completed,
        completedAt: payload.completed ? now : null,
      },
      pollAfterMs: POLL_AFTER_MS,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

function isCompletionPayload(value: unknown): value is { completed: boolean } {
  return (
    typeof value === "object" &&
    value !== null &&
    "completed" in value &&
    typeof value.completed === "boolean"
  );
}
