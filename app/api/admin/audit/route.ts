import { and, desc, eq, lt } from "drizzle-orm";
import { getDb } from "@/db";
import { auditLogs } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { CAMPAIGN_ID } from "@/lib/server/constants";
import { errorResponse, json } from "@/lib/server/response";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireAdmin(request);
    const cursor = new URL(request.url).searchParams.get("before");
    const where = cursor
      ? and(
          eq(auditLogs.campaignId, CAMPAIGN_ID),
          lt(auditLogs.createdAt, cursor),
        )
      : eq(auditLogs.campaignId, CAMPAIGN_ID);
    const rows = await getDb()
      .select()
      .from(auditLogs)
      .where(where)
      .orderBy(desc(auditLogs.createdAt), desc(auditLogs.id))
      .limit(100);

    return json({
      audit: rows.map((row) => ({
        id: row.id,
        actorRole: row.actorRole,
        actorId: row.actorId,
        action: row.action,
        targetType: row.targetType,
        targetId: row.targetId,
        before: parseJson(row.beforeJson),
        after: parseJson(row.afterJson),
        createdAt: row.createdAt,
      })),
      nextCursor: rows.length === 100 ? rows.at(-1)?.createdAt ?? null : null,
    });
  } catch (error) {
    return errorResponse(error);
  }
}

function parseJson(value: string | null) {
  if (!value) return null;
  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}
