import { getKstDateKey } from "@/lib/domain/campaign-clock";
import { secureEqual } from "@/lib/server/crypto";
import { purgePersonalDataIfDue } from "@/lib/server/database";
import { ApiError, errorResponse, json } from "@/lib/server/response";
import { getPurgeSecret } from "@/lib/server/secrets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const authorization = request.headers.get("authorization") ?? "";
    const match = /^Bearer ([A-Za-z0-9_-]{43,128})$/u.exec(authorization);
    if (!match || !(await secureEqual(match[1], getPurgeSecret()))) {
      throw new ApiError(401, "INVALID_PURGE_TOKEN", "인증에 실패했습니다.");
    }

    const now = new Date();
    if (getKstDateKey(now) < "2026-09-09") {
      throw new ApiError(
        423,
        "RETENTION_NOT_DUE",
        "개인정보 보관 종료일 전에는 삭제할 수 없습니다.",
      );
    }

    const purged = await purgePersonalDataIfDue(now);
    return json({ status: purged ? "purged" : "already_purged" });
  } catch (error) {
    return errorResponse(error);
  }
}
