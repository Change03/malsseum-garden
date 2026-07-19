import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const campaigns = sqliteTable("campaigns", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  timezone: text("timezone").notNull(),
  retentionDeleteAt: text("retention_delete_at").notNull(),
  status: text("status").notNull().default("scheduled"),
  anonymousTotal: integer("anonymous_total").notNull().default(0),
  personalDataDeletedAt: text("personal_data_deleted_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const participants = sqliteTable(
  "participants",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull(),
    role: text("role").notNull().default("member"),
    inviteTokenHash: text("invite_token_hash").notNull(),
    consentedAt: text("consented_at"),
    active: integer("active", { mode: "boolean" }).notNull().default(true),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("participants_campaign_order_uq").on(
      table.campaignId,
      table.sortOrder,
    ),
    uniqueIndex("participants_invite_hash_uq").on(table.inviteTokenHash),
    index("participants_campaign_idx").on(table.campaignId),
  ],
);

export const adminCredentials = sqliteTable("admin_credentials", {
  id: text("id").primaryKey(),
  campaignId: text("campaign_id")
    .notNull()
    .references(() => campaigns.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  rotatedAt: text("rotated_at"),
  createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
});

export const sessions = sqliteTable(
  "sessions",
  {
    tokenHash: text("token_hash").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    participantId: text("participant_id").references(() => participants.id, {
      onDelete: "cascade",
    }),
    role: text("role").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    expiresAt: text("expires_at").notNull(),
    revokedAt: text("revoked_at"),
  },
  (table) => [
    index("sessions_participant_idx").on(table.participantId),
    index("sessions_expiry_idx").on(table.expiresAt),
  ],
);

export const devotionalDays = sqliteTable(
  "devotional_days",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    date: text("date").notNull(),
    dayOrder: integer("day_order").notNull(),
    title: text("title").notNull(),
    passageReference: text("passage_reference").notNull(),
    sourceUrl: text("source_url").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("devotional_days_campaign_date_uq").on(
      table.campaignId,
      table.date,
    ),
    uniqueIndex("devotional_days_campaign_order_uq").on(
      table.campaignId,
      table.dayOrder,
    ),
  ],
);

export const contentVariants = sqliteTable(
  "content_variants",
  {
    id: text("id").primaryKey(),
    dayId: text("day_id")
      .notNull()
      .references(() => devotionalDays.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    variantKey: text("variant_key").notNull(),
    label: text("label").notNull(),
    mode: text("mode").notNull(),
    sourceName: text("source_name").notNull(),
    sourceUrl: text("source_url").notNull(),
    translationKey: text("translation_key"),
    commentaryKey: text("commentary_key"),
    bodyJson: text("body_json"),
    rightsConfirmed: integer("rights_confirmed", { mode: "boolean" })
      .notNull()
      .default(false),
    rightsExpiresAt: text("rights_expires_at"),
    copyAllowed: integer("copy_allowed", { mode: "boolean" })
      .notNull()
      .default(false),
    maxCopyVerses: integer("max_copy_verses").notNull().default(0),
    published: integer("published", { mode: "boolean" })
      .notNull()
      .default(true),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("content_variants_day_kind_key_uq").on(
      table.dayId,
      table.kind,
      table.variantKey,
    ),
    index("content_variants_day_idx").on(table.dayId),
  ],
);

export const completions = sqliteTable(
  "completions",
  {
    participantId: text("participant_id")
      .notNull()
      .references(() => participants.id, { onDelete: "cascade" }),
    dayId: text("day_id")
      .notNull()
      .references(() => devotionalDays.id, { onDelete: "cascade" }),
    completed: integer("completed", { mode: "boolean" })
      .notNull()
      .default(false),
    completedAt: text("completed_at"),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
    updatedByRole: text("updated_by_role").notNull(),
    updatedById: text("updated_by_id"),
  },
  (table) => [
    uniqueIndex("completions_participant_day_uq").on(
      table.participantId,
      table.dayId,
    ),
    index("completions_day_idx").on(table.dayId),
  ],
);

export const auditLogs = sqliteTable(
  "audit_logs",
  {
    id: text("id").primaryKey(),
    campaignId: text("campaign_id")
      .notNull()
      .references(() => campaigns.id, { onDelete: "cascade" }),
    actorRole: text("actor_role").notNull(),
    actorId: text("actor_id"),
    action: text("action").notNull(),
    targetType: text("target_type").notNull(),
    targetId: text("target_id").notNull(),
    beforeJson: text("before_json"),
    afterJson: text("after_json"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [index("audit_logs_campaign_created_idx").on(table.campaignId, table.createdAt)],
);
