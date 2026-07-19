import { eq } from "drizzle-orm";
import { getD1, getDb } from "@/db";
import { contentVariants, devotionalDays } from "@/db/schema";
import { requireAdmin } from "@/lib/server/auth";
import { CAMPAIGN_END_DATE, CAMPAIGN_ID } from "@/lib/server/constants";
import { randomId } from "@/lib/server/crypto";
import {
  ApiError,
  errorResponse,
  isSameOriginMutation,
  json,
  readJson,
} from "@/lib/server/response";

export const dynamic = "force-dynamic";

type ContentKind = "bible" | "commentary";
type ContentMode = "external" | "embedded";

type ImportInput = {
  dayId: string;
  kind: ContentKind;
  variantKey: string;
  label: string;
  mode: ContentMode;
  sourceName: string;
  sourceUrl: string;
  translationKey?: string | null;
  commentaryKey?: string | null;
  body?: unknown;
  rightsConfirmed?: boolean;
  rightsExpiresAt?: string | null;
  copyAllowed?: boolean;
  maxCopyVerses?: number;
  published?: boolean;
};

type NormalizedInput = Omit<ImportInput, "body"> & {
  bodyJson: string | null;
  rightsConfirmed: boolean;
  rightsExpiresAt: string | null;
  copyAllowed: boolean;
  maxCopyVerses: number;
  published: boolean;
};

export async function POST(request: Request) {
  try {
    if (!isSameOriginMutation(request)) {
      throw new ApiError(403, "ORIGIN_MISMATCH", "허용되지 않은 요청입니다.");
    }
    await requireAdmin(request);
    const payload = await readJson(request);
    const inputs = extractInputs(payload);
    const normalized = inputs.map(normalizeInput);
    const db = getDb();
    const dayRows = await db
      .select({ id: devotionalDays.id })
      .from(devotionalDays)
      .where(eq(devotionalDays.campaignId, CAMPAIGN_ID));
    const validDayIds = new Set(dayRows.map((day) => day.id));
    for (const item of normalized) {
      if (!validDayIds.has(item.dayId)) {
        throw new ApiError(
          400,
          "INVALID_DAY",
          `${item.dayId}는 이 캠페인의 묵상 날짜가 아닙니다.`,
        );
      }
    }

    const existingRows = await db
      .select({
        dayId: contentVariants.dayId,
        kind: contentVariants.kind,
        variantKey: contentVariants.variantKey,
        mode: contentVariants.mode,
        rightsExpiresAt: contentVariants.rightsExpiresAt,
        published: contentVariants.published,
      })
      .from(contentVariants)
      .innerJoin(devotionalDays, eq(contentVariants.dayId, devotionalDays.id))
      .where(eq(devotionalDays.campaignId, CAMPAIGN_ID));
    const existingByKey = new Map(
      existingRows.map((row) => [
        `${row.dayId}:${row.kind}:${row.variantKey}`,
        {
          mode: row.mode,
          rightsExpiresAt: row.rightsExpiresAt,
          published: row.published,
        },
      ]),
    );
    const importedAt = new Date().toISOString();
    const d1 = getD1();
    const statements = normalized.flatMap((item) => {
      const id = `${item.dayId}-${item.kind}-${item.variantKey}`;
      const before =
        existingByKey.get(`${item.dayId}:${item.kind}:${item.variantKey}`) ?? null;
      const after = {
        dayId: item.dayId,
        kind: item.kind,
        variantKey: item.variantKey,
        mode: item.mode,
        sourceName: item.sourceName,
        sourceUrl: item.sourceUrl,
        rightsConfirmed: item.rightsConfirmed,
        rightsExpiresAt: item.rightsExpiresAt,
        copyAllowed: item.copyAllowed,
        maxCopyVerses: item.maxCopyVerses,
        published: item.published,
      };
      return [
        d1
          .prepare(
            `INSERT INTO content_variants
              (id, day_id, kind, variant_key, label, mode, source_name, source_url,
               translation_key, commentary_key, body_json, rights_confirmed,
               rights_expires_at, copy_allowed, max_copy_verses, published, updated_at)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
              ON CONFLICT(day_id, kind, variant_key) DO UPDATE SET
                label = excluded.label,
                mode = excluded.mode,
                source_name = excluded.source_name,
                source_url = excluded.source_url,
                translation_key = excluded.translation_key,
                commentary_key = excluded.commentary_key,
                body_json = excluded.body_json,
                rights_confirmed = excluded.rights_confirmed,
                rights_expires_at = excluded.rights_expires_at,
                copy_allowed = excluded.copy_allowed,
                max_copy_verses = excluded.max_copy_verses,
                published = excluded.published,
                updated_at = excluded.updated_at`,
          )
          .bind(
            id,
            item.dayId,
            item.kind,
            item.variantKey,
            item.label,
            item.mode,
            item.sourceName,
            item.sourceUrl,
            item.translationKey ?? null,
            item.commentaryKey ?? null,
            item.bodyJson,
            item.rightsConfirmed ? 1 : 0,
            item.rightsExpiresAt,
            item.copyAllowed ? 1 : 0,
            item.maxCopyVerses,
            item.published ? 1 : 0,
            importedAt,
          ),
        d1
          .prepare(
            `INSERT INTO audit_logs
              (id, campaign_id, actor_role, actor_id, action, target_type,
               target_id, before_json, after_json, created_at)
              VALUES (?, ?, 'admin', 'admin', 'content.imported',
                      'content_variant', ?, ?, ?, ?)`,
          )
          .bind(
            randomId(),
            CAMPAIGN_ID,
            id,
            before ? JSON.stringify(before) : null,
            JSON.stringify(after),
            importedAt,
          ),
      ];
    });
    await d1.batch(statements);

    return json({
      imported: normalized.length,
      importedAt,
      variants: normalized.map((item) => ({
        id: `${item.dayId}-${item.kind}-${item.variantKey}`,
        dayId: item.dayId,
        kind: item.kind,
        key: item.variantKey,
        mode: item.mode,
        rightsExpiresAt: item.rightsExpiresAt,
        published: item.published,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

function extractInputs(value: unknown): ImportInput[] {
  if (typeof value !== "object" || value === null) {
    throw new ApiError(400, "INVALID_IMPORT", "가져올 콘텐츠가 필요합니다.");
  }
  const raw = "variants" in value ? value.variants : value;
  const values = Array.isArray(raw) ? raw : [raw];
  if (values.length < 1 || values.length > 50) {
    throw new ApiError(
      400,
      "INVALID_IMPORT_COUNT",
      "한 번에 1개부터 50개까지 가져올 수 있습니다.",
    );
  }
  return values as ImportInput[];
}

function normalizeInput(value: ImportInput): NormalizedInput {
  if (typeof value !== "object" || value === null) {
    throw new ApiError(400, "INVALID_IMPORT", "콘텐츠 형식을 확인해 주세요.");
  }
  if (!isShortText(value.dayId, 20)) {
    throw new ApiError(400, "INVALID_DAY", "dayId를 확인해 주세요.");
  }
  if (value.kind !== "bible" && value.kind !== "commentary") {
    throw new ApiError(400, "INVALID_KIND", "콘텐츠 종류를 확인해 주세요.");
  }
  if (!/^[a-z0-9][a-z0-9_-]{0,31}$/u.test(value.variantKey)) {
    throw new ApiError(400, "INVALID_VARIANT_KEY", "variantKey를 확인해 주세요.");
  }
  if (!isShortText(value.label, 60) || !isShortText(value.sourceName, 100)) {
    throw new ApiError(400, "INVALID_LABEL", "표시명과 출처명을 확인해 주세요.");
  }
  if (value.mode !== "external" && value.mode !== "embedded") {
    throw new ApiError(400, "INVALID_MODE", "콘텐츠 모드를 확인해 주세요.");
  }
  assertHttpsUrl(value.sourceUrl);
  if (value.kind === "bible" && !isShortText(value.translationKey, 40)) {
    throw new ApiError(400, "TRANSLATION_REQUIRED", "성경 번역명을 입력해 주세요.");
  }
  if (value.kind === "commentary" && !isShortText(value.commentaryKey, 60)) {
    throw new ApiError(400, "COMMENTARY_REQUIRED", "해설판 이름을 입력해 주세요.");
  }
  if (
    value.kind === "commentary" &&
    value.commentaryKey === "매일성경 순" &&
    value.translationKey !== "새번역"
  ) {
    throw new ApiError(
      400,
      "PURE_REQUIRES_NEW_TRANSLATION",
      "매일성경 순은 새번역으로 등록해야 합니다.",
    );
  }

  if (value.mode === "external") {
    if (value.body !== undefined && value.body !== null) {
      throw new ApiError(
        400,
        "EXTERNAL_BODY_FORBIDDEN",
        "외부 링크 모드에는 본문이나 해설 전문을 넣을 수 없습니다.",
      );
    }
    return {
      ...value,
      bodyJson: null,
      rightsConfirmed: false,
      rightsExpiresAt: null,
      copyAllowed: false,
      maxCopyVerses: 0,
      published: value.published !== false,
    };
  }

  if (value.rightsConfirmed !== true) {
    throw new ApiError(
      400,
      "RIGHTS_CONFIRMATION_REQUIRED",
      "내장 콘텐츠는 서면 이용 허가 확인이 필요합니다.",
    );
  }
  if (
    typeof value.rightsExpiresAt !== "string" ||
    !isRealDateKey(value.rightsExpiresAt) ||
    value.rightsExpiresAt < CAMPAIGN_END_DATE
  ) {
    throw new ApiError(
      400,
      "INVALID_RIGHTS_EXPIRY",
      "허가 만료일은 캠페인 종료일 이후여야 합니다.",
    );
  }

  const bodyJson = JSON.stringify(
    value.kind === "bible"
      ? normalizeBibleBody(value.body)
      : normalizeCommentaryBody(value.body),
  );
  const copyAllowed = value.kind === "bible" && value.copyAllowed === true;
  if (copyAllowed && value.maxCopyVerses !== 1) {
    throw new ApiError(
      400,
      "INVALID_COPY_LIMIT",
      "말씀 공유는 한 절까지만 허용할 수 있습니다.",
    );
  }

  return {
    ...value,
    bodyJson,
    rightsConfirmed: true,
    rightsExpiresAt: value.rightsExpiresAt,
    copyAllowed,
    maxCopyVerses: copyAllowed ? 1 : 0,
    published: value.published !== false,
  };
}

function normalizeBibleBody(value: unknown) {
  if (typeof value !== "object" || value === null || !("verses" in value)) {
    throw new ApiError(400, "INVALID_BIBLE_BODY", "절 단위 본문이 필요합니다.");
  }
  if (!Array.isArray(value.verses) || value.verses.length < 1 || value.verses.length > 300) {
    throw new ApiError(400, "INVALID_BIBLE_BODY", "본문 절 수를 확인해 주세요.");
  }
  const verses = value.verses.map((verse) => {
    if (
      typeof verse !== "object" ||
      verse === null ||
      !("number" in verse) ||
      !("text" in verse) ||
      !isShortText(verse.number, 20) ||
      !isShortText(verse.text, 1_000)
    ) {
      throw new ApiError(400, "INVALID_BIBLE_VERSE", "절 번호와 본문을 확인해 주세요.");
    }
    return { number: verse.number.trim(), text: verse.text.trim() };
  });
  return { verses };
}

function normalizeCommentaryBody(value: unknown) {
  if (typeof value !== "object" || value === null || !("paragraphs" in value)) {
    throw new ApiError(400, "INVALID_COMMENTARY_BODY", "해설 문단이 필요합니다.");
  }
  if (
    !Array.isArray(value.paragraphs) ||
    value.paragraphs.length < 1 ||
    value.paragraphs.length > 100 ||
    value.paragraphs.some((paragraph) => !isShortText(paragraph, 5_000))
  ) {
    throw new ApiError(400, "INVALID_COMMENTARY_BODY", "해설 문단을 확인해 주세요.");
  }
  return { paragraphs: value.paragraphs.map((paragraph) => paragraph.trim()) };
}

function isShortText(value: unknown, maxLength: number): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.trim().length <= maxLength
  );
}

function assertHttpsUrl(value: unknown) {
  if (typeof value !== "string" || value.length > 2_000) {
    throw new ApiError(400, "INVALID_SOURCE_URL", "출처 URL을 확인해 주세요.");
  }
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") throw new Error("https required");
  } catch {
    throw new ApiError(400, "INVALID_SOURCE_URL", "HTTPS 출처 URL이 필요합니다.");
  }
}

function isRealDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/u.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  const candidate = new Date(Date.UTC(year, month - 1, day));
  return (
    candidate.getUTCFullYear() === year &&
    candidate.getUTCMonth() === month - 1 &&
    candidate.getUTCDate() === day
  );
}
