import { getD1 } from "@/db";
import { BUILT_IN_VARIANT_SEEDS } from "./built-in-content";
import {
  CAMPAIGN_END_DATE,
  CAMPAIGN_ID,
  CAMPAIGN_START_DATE,
  CAMPAIGN_TIMEZONE,
  CAMPAIGN_TITLE,
  DAY_SEEDS,
  EXTERNAL_VARIANT_SEEDS,
  OFFICIAL_SOURCE_NAME,
  OFFICIAL_SOURCE_URL,
  RETENTION_DELETE_AT,
} from "./constants";
import { getWordGardenSeed } from "./secrets";

const SCHEMA_STATEMENTS = [
  `CREATE TABLE IF NOT EXISTS campaigns (
    id text PRIMARY KEY NOT NULL,
    title text NOT NULL,
    start_date text NOT NULL,
    end_date text NOT NULL,
    timezone text NOT NULL,
    retention_delete_at text NOT NULL,
    status text DEFAULT 'scheduled' NOT NULL,
    anonymous_total integer DEFAULT 0 NOT NULL,
    personal_data_deleted_at text,
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL
  )`,
  `CREATE TABLE IF NOT EXISTS participants (
    id text PRIMARY KEY NOT NULL,
    campaign_id text NOT NULL,
    name text NOT NULL,
    sort_order integer NOT NULL,
    role text DEFAULT 'member' NOT NULL,
    invite_token_hash text NOT NULL,
    consented_at text,
    active integer DEFAULT 1 NOT NULL,
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE cascade
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS participants_campaign_order_uq ON participants (campaign_id, sort_order)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS participants_invite_hash_uq ON participants (invite_token_hash)`,
  `CREATE INDEX IF NOT EXISTS participants_campaign_idx ON participants (campaign_id)`,
  `CREATE TABLE IF NOT EXISTS admin_credentials (
    id text PRIMARY KEY NOT NULL,
    campaign_id text NOT NULL,
    token_hash text NOT NULL UNIQUE,
    active integer DEFAULT 1 NOT NULL,
    rotated_at text,
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE cascade
  )`,
  `CREATE TABLE IF NOT EXISTS sessions (
    token_hash text PRIMARY KEY NOT NULL,
    campaign_id text NOT NULL,
    participant_id text,
    role text NOT NULL,
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at text NOT NULL,
    revoked_at text,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE cascade,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE cascade
  )`,
  `CREATE INDEX IF NOT EXISTS sessions_participant_idx ON sessions (participant_id)`,
  `CREATE INDEX IF NOT EXISTS sessions_expiry_idx ON sessions (expires_at)`,
  `CREATE TABLE IF NOT EXISTS devotional_days (
    id text PRIMARY KEY NOT NULL,
    campaign_id text NOT NULL,
    date text NOT NULL,
    day_order integer NOT NULL,
    title text NOT NULL,
    passage_reference text NOT NULL,
    source_url text NOT NULL,
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE cascade
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS devotional_days_campaign_date_uq ON devotional_days (campaign_id, date)`,
  `CREATE UNIQUE INDEX IF NOT EXISTS devotional_days_campaign_order_uq ON devotional_days (campaign_id, day_order)`,
  `CREATE TABLE IF NOT EXISTS content_variants (
    id text PRIMARY KEY NOT NULL,
    day_id text NOT NULL,
    kind text NOT NULL,
    variant_key text NOT NULL,
    label text NOT NULL,
    mode text NOT NULL,
    source_name text NOT NULL,
    source_url text NOT NULL,
    translation_key text,
    commentary_key text,
    body_json text,
    rights_confirmed integer DEFAULT 0 NOT NULL,
    rights_expires_at text,
    copy_allowed integer DEFAULT 0 NOT NULL,
    max_copy_verses integer DEFAULT 0 NOT NULL,
    published integer DEFAULT 1 NOT NULL,
    updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (day_id) REFERENCES devotional_days(id) ON DELETE cascade
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS content_variants_day_kind_key_uq ON content_variants (day_id, kind, variant_key)`,
  `CREATE INDEX IF NOT EXISTS content_variants_day_idx ON content_variants (day_id)`,
  `CREATE TABLE IF NOT EXISTS completions (
    participant_id text NOT NULL,
    day_id text NOT NULL,
    completed integer DEFAULT 0 NOT NULL,
    completed_at text,
    updated_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_by_role text NOT NULL,
    updated_by_id text,
    FOREIGN KEY (participant_id) REFERENCES participants(id) ON DELETE cascade,
    FOREIGN KEY (day_id) REFERENCES devotional_days(id) ON DELETE cascade
  )`,
  `CREATE UNIQUE INDEX IF NOT EXISTS completions_participant_day_uq ON completions (participant_id, day_id)`,
  `CREATE INDEX IF NOT EXISTS completions_day_idx ON completions (day_id)`,
  `CREATE TABLE IF NOT EXISTS audit_logs (
    id text PRIMARY KEY NOT NULL,
    campaign_id text NOT NULL,
    actor_role text NOT NULL,
    actor_id text,
    action text NOT NULL,
    target_type text NOT NULL,
    target_id text NOT NULL,
    before_json text,
    after_json text,
    created_at text DEFAULT CURRENT_TIMESTAMP NOT NULL,
    FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE cascade
  )`,
  `CREATE INDEX IF NOT EXISTS audit_logs_campaign_created_idx ON audit_logs (campaign_id, created_at)`,
] as const;

let initialization: Promise<void> | null = null;

export async function ensureDatabase() {
  if (!initialization) {
    initialization = initializeDatabase().catch((error) => {
      initialization = null;
      throw error;
    });
  }
  await initialization;
}

async function initializeDatabase() {
  const d1 = getD1();
  const privateSeed = getWordGardenSeed();
  await d1.batch(SCHEMA_STATEMENTS.map((statement) => d1.prepare(statement)));

  const seedStatements = [
    d1
      .prepare(
        `INSERT INTO campaigns
          (id, title, start_date, end_date, timezone, retention_delete_at, status)
          VALUES (?, ?, ?, ?, ?, ?, 'scheduled')
          ON CONFLICT(id) DO UPDATE SET
            title = excluded.title,
            start_date = excluded.start_date,
            end_date = excluded.end_date,
            timezone = excluded.timezone,
            retention_delete_at = excluded.retention_delete_at,
            status = CASE
              WHEN campaigns.personal_data_deleted_at IS NULL THEN 'scheduled'
              ELSE campaigns.status
            END`,
      )
      .bind(
        CAMPAIGN_ID,
        CAMPAIGN_TITLE,
        CAMPAIGN_START_DATE,
        CAMPAIGN_END_DATE,
        CAMPAIGN_TIMEZONE,
        RETENTION_DELETE_AT,
      ),
    ...privateSeed.participants.map((participant) =>
      d1
        .prepare(
          `INSERT OR IGNORE INTO participants
            (id, campaign_id, name, sort_order, role, invite_token_hash, consented_at, active)
            SELECT ?, ?, ?, ?, 'member', ?, NULL, 1
            WHERE EXISTS (
              SELECT 1 FROM campaigns
              WHERE id = ? AND personal_data_deleted_at IS NULL
            )`,
        )
        .bind(
          participant.id,
          CAMPAIGN_ID,
          participant.name,
          participant.sortOrder,
          participant.inviteTokenHash,
          CAMPAIGN_ID,
        ),
    ),
    d1
      .prepare(
        `INSERT OR IGNORE INTO admin_credentials
          (id, campaign_id, token_hash, active)
          SELECT 'admin', ?, ?, 1
          WHERE EXISTS (
            SELECT 1 FROM campaigns
            WHERE id = ? AND personal_data_deleted_at IS NULL
          )`,
      )
      .bind(CAMPAIGN_ID, privateSeed.admin.tokenHash, CAMPAIGN_ID),
    ...DAY_SEEDS.map(([id, date, dayOrder, passageReference]) =>
      d1
        .prepare(
          `INSERT INTO devotional_days
            (id, campaign_id, date, day_order, title, passage_reference, source_url)
            VALUES (?, ?, ?, ?, ?, ?, ?)
            ON CONFLICT(id) DO UPDATE SET
              campaign_id = excluded.campaign_id,
              date = excluded.date,
              day_order = excluded.day_order,
              title = excluded.title,
              passage_reference = excluded.passage_reference,
              source_url = excluded.source_url`,
        )
        .bind(
          id,
          CAMPAIGN_ID,
          date,
          dayOrder,
          passageReference,
          passageReference,
          OFFICIAL_SOURCE_URL,
        ),
    ),
    ...DAY_SEEDS.flatMap(([dayId]) =>
      EXTERNAL_VARIANT_SEEDS.map((variant) =>
        d1
          .prepare(
            `INSERT OR IGNORE INTO content_variants
              (id, day_id, kind, variant_key, label, mode, source_name, source_url,
               translation_key, commentary_key, body_json, rights_confirmed,
               rights_expires_at, copy_allowed, max_copy_verses, published)
              VALUES (?, ?, ?, ?, ?, 'external', ?, ?, ?, ?, NULL, 0, NULL, 0, 0, 1)`,
          )
          .bind(
            `${dayId}-${variant.kind}-${variant.key}`,
            dayId,
            variant.kind,
            variant.key,
            variant.label,
            OFFICIAL_SOURCE_NAME,
            OFFICIAL_SOURCE_URL,
            variant.translationKey,
            variant.commentaryKey,
          ),
      ),
    ),
    ...BUILT_IN_VARIANT_SEEDS.map((variant) =>
      d1
        .prepare(
          `INSERT INTO content_variants
            (id, day_id, kind, variant_key, label, mode, source_name, source_url,
             translation_key, commentary_key, body_json, rights_confirmed,
             rights_expires_at, copy_allowed, max_copy_verses, published)
            VALUES (?, ?, ?, ?, ?, 'embedded', ?, ?, ?, ?, ?, 1, NULL, ?, ?, 1)
            ON CONFLICT(id) DO UPDATE SET
              day_id = excluded.day_id,
              kind = excluded.kind,
              variant_key = excluded.variant_key,
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
              updated_at = CURRENT_TIMESTAMP`,
        )
        .bind(
          `${variant.dayId}-${variant.kind}-${variant.key}`,
          variant.dayId,
          variant.kind,
          variant.key,
          variant.label,
          variant.sourceName,
          variant.sourceUrl,
          variant.translationKey,
          variant.commentaryKey,
          JSON.stringify(variant.body),
          variant.copyAllowed ? 1 : 0,
          variant.maxCopyVerses,
        ),
    ),
  ];

  for (let offset = 0; offset < seedStatements.length; offset += 10) {
    await d1.batch(seedStatements.slice(offset, offset + 10));
  }
}

export async function purgePersonalDataIfDue(now = new Date()) {
  await ensureDatabase();
  await pruneSessions(now);
  if (now.getTime() < new Date(RETENTION_DELETE_AT).getTime()) return false;

  const d1 = getD1();
  const campaign = await d1
    .prepare(
      "SELECT personal_data_deleted_at FROM campaigns WHERE id = ? LIMIT 1",
    )
    .bind(CAMPAIGN_ID)
    .first<{ personal_data_deleted_at: string | null }>();

  if (!campaign || campaign.personal_data_deleted_at) return false;

  const aggregate = await d1
    .prepare(
      `SELECT COUNT(*) AS total
        FROM completions
        INNER JOIN participants ON participants.id = completions.participant_id
        INNER JOIN devotional_days ON devotional_days.id = completions.day_id
        WHERE completions.completed = 1
          AND participants.campaign_id = ?
          AND devotional_days.campaign_id = ?`,
    )
    .bind(CAMPAIGN_ID, CAMPAIGN_ID)
    .first<{ total: number }>();
  const deletedAt = now.toISOString();

  await d1.batch([
    d1
      .prepare(
        `UPDATE campaigns
          SET anonymous_total = CASE
                WHEN personal_data_deleted_at IS NULL THEN ?
                ELSE anonymous_total
              END,
              personal_data_deleted_at = COALESCE(personal_data_deleted_at, ?),
              status = 'deleted'
          WHERE id = ?`,
      )
      .bind(Number(aggregate?.total ?? 0), deletedAt, CAMPAIGN_ID),
    d1.prepare("DELETE FROM sessions WHERE campaign_id = ?").bind(CAMPAIGN_ID),
    d1.prepare("DELETE FROM audit_logs WHERE campaign_id = ?").bind(CAMPAIGN_ID),
    d1
      .prepare(
        `DELETE FROM completions
          WHERE participant_id IN (
            SELECT id FROM participants WHERE campaign_id = ?
          )`,
      )
      .bind(CAMPAIGN_ID),
    d1.prepare("DELETE FROM participants WHERE campaign_id = ?").bind(CAMPAIGN_ID),
    d1
      .prepare("DELETE FROM admin_credentials WHERE campaign_id = ?")
      .bind(CAMPAIGN_ID),
  ]);

  return true;
}

async function pruneSessions(now: Date) {
  const d1 = getD1();
  const revokedCutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1_000).toISOString();
  await d1
    .prepare(
      `DELETE FROM sessions
        WHERE campaign_id = ?
          AND (
            expires_at <= ?
            OR (revoked_at IS NOT NULL AND revoked_at <= ?)
          )`,
    )
    .bind(CAMPAIGN_ID, now.toISOString(), revokedCutoff)
    .run();
}
