export function json(data: unknown, init: ResponseInit | number = 200) {
  const responseInit = typeof init === "number" ? { status: init } : init;
  const headers = new Headers(responseInit.headers);
  headers.set("Cache-Control", "no-store, private");
  return Response.json(data, { ...responseInit, headers });
}

export function problem(status: number, code: string, message: string) {
  return json({ error: { code, message } }, status);
}

export function isSameOriginMutation(request: Request) {
  const origin = request.headers.get("origin");
  if (origin !== new URL(request.url).origin) return false;
  const fetchSite = request.headers.get("sec-fetch-site");
  return !fetchSite || fetchSite === "same-origin";
}

export async function readJson(request: Request) {
  if (!request.headers.get("content-type")?.toLowerCase().includes("application/json")) {
    throw new ApiError(415, "UNSUPPORTED_MEDIA_TYPE", "JSON 요청만 허용됩니다.");
  }
  try {
    return (await request.json()) as unknown;
  } catch {
    throw new ApiError(400, "INVALID_JSON", "올바른 JSON 요청이 아닙니다.");
  }
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
  ) {
    super(message);
  }
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return problem(error.status, error.code, error.message);
  }
  return problem(500, "INTERNAL_ERROR", "요청을 처리하지 못했습니다.");
}
