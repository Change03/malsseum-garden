import { getViewer } from "@/lib/server/auth";
import { ApiError, errorResponse, json } from "@/lib/server/response";
import { buildWeekPayload } from "@/lib/server/week";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const viewer = await getViewer(request);
    if (!viewer) {
      throw new ApiError(401, "AUTH_REQUIRED", "첫 화면에서 내 이름을 선택해 주세요.");
    }
    if (viewer.role === "member" && !viewer.consentedAt) {
      return json(
        {
          consentRequired: true,
          name: viewer.name,
          error: {
            code: "CONSENT_REQUIRED",
            message: "이름과 읽음 상태 공유에 먼저 동의해 주세요.",
          },
        },
        403,
      );
    }
    return json(await buildWeekPayload(viewer));
  } catch (error) {
    return errorResponse(error);
  }
}
