import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLogs, participants, sessions } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { CAMPAIGN_ID } from "@/lib/server/constants";
import { randomId, randomToken, sha256 } from "@/lib/server/crypto";
import {
  ApiError,
  errorResponse,
  isSameOriginMutation,
  json,
} from "@/lib/server/response";

export const dynamic = "force-dynamic";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ participantId: string }> },
) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    await requireAdmin(request);
    const { participantId } = await params;
    const db = getDb();
    const [participant] = await db
      .select({ id: participants.id, name: participants.name })
      .from(participants)
      .where(
        and(
          eq(participants.id, participantId),
          eq(participants.campaignId, CAMPAIGN_ID),
          eq(participants.active, true),
        ),
      )
      .limit(1);

    if (!participant) {
      throw new ApiError(
        404,
        "PARTICIPANT_NOT_FOUND",
        "참여자를 찾을 수 없습니다.",
      );
    }

    const token = randomToken();
    const tokenHash = await sha256(token);
    const rotatedAt = new Date().toISOString();
    await db.batch([
      db
        .update(participants)
        .set({ inviteTokenHash: tokenHash })
        .where(eq(participants.id, participant.id)),
      db
        .update(sessions)
        .set({ revokedAt: rotatedAt })
        .where(
          and(
            eq(sessions.participantId, participant.id),
            isNull(sessions.revokedAt),
          ),
        ),
      db.insert(auditLogs).values({
        id: randomId(),
        campaignId: CAMPAIGN_ID,
        actorRole: "admin",
        actorId: "admin",
        action: "invitation.rotated",
        targetType: "participant",
        targetId: participant.id,
        beforeJson: JSON.stringify({ invitationActive: true }),
        afterJson: JSON.stringify({ rotatedAt, sessionsRevoked: true }),
      }),
    ]);

    return json({
      invitation: {
        participantId: participant.id,
        participantName: participant.name,
        token,
        inviteUrl: new URL(`/invite/${token}`, request.url).toString(),
        rotatedAt,
      },
      notice: "이 토큰은 다시 조회할 수 없습니다. 지금 안전하게 전달해 주세요.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
