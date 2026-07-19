import { and, eq, isNull } from "drizzle-orm";
import { getDb } from "@/db";
import { adminCredentials, auditLogs, sessions } from "@/db/schema";
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

export async function POST(request: Request) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    await requireAdmin(request);
    const token = randomToken();
    const tokenHash = await sha256(token);
    const rotatedAt = new Date().toISOString();
    const db = getDb();

    await db.batch([
      db
        .update(adminCredentials)
        .set({ tokenHash, rotatedAt })
        .where(
          and(
            eq(adminCredentials.id, "admin"),
            eq(adminCredentials.campaignId, CAMPAIGN_ID),
            eq(adminCredentials.active, true),
          ),
        ),
      db
        .update(sessions)
        .set({ revokedAt: rotatedAt })
        .where(
          and(
            eq(sessions.campaignId, CAMPAIGN_ID),
            eq(sessions.role, "admin"),
            isNull(sessions.revokedAt),
          ),
        ),
      db.insert(auditLogs).values({
        id: randomId(),
        campaignId: CAMPAIGN_ID,
        actorRole: "admin",
        actorId: "admin",
        action: "admin_credential.rotated",
        targetType: "admin_credential",
        targetId: "admin",
        beforeJson: JSON.stringify({ active: true }),
        afterJson: JSON.stringify({ rotatedAt, sessionsRevoked: true }),
      }),
    ]);

    return json({
      credential: {
        token,
        inviteUrl: new URL(`/invite/${token}`, request.url).toString(),
        rotatedAt,
      },
      notice: "이 토큰은 다시 조회할 수 없습니다. 지금 안전하게 보관해 주세요.",
    });
  } catch (error) {
    return errorResponse(error);
  }
}
