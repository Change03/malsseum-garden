CREATE TABLE `admin_credentials` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`token_hash` text NOT NULL,
	`active` integer DEFAULT true NOT NULL,
	`rotated_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `admin_credentials_token_hash_unique` ON `admin_credentials` (`token_hash`);--> statement-breakpoint
CREATE TABLE `audit_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`actor_role` text NOT NULL,
	`actor_id` text,
	`action` text NOT NULL,
	`target_type` text NOT NULL,
	`target_id` text NOT NULL,
	`before_json` text,
	`after_json` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `audit_logs_campaign_created_idx` ON `audit_logs` (`campaign_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `campaigns` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`timezone` text NOT NULL,
	`retention_delete_at` text NOT NULL,
	`status` text DEFAULT 'scheduled' NOT NULL,
	`anonymous_total` integer DEFAULT 0 NOT NULL,
	`personal_data_deleted_at` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `completions` (
	`participant_id` text NOT NULL,
	`day_id` text NOT NULL,
	`completed` integer DEFAULT false NOT NULL,
	`completed_at` text,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_by_role` text NOT NULL,
	`updated_by_id` text,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`day_id`) REFERENCES `devotional_days`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `completions_participant_day_uq` ON `completions` (`participant_id`,`day_id`);--> statement-breakpoint
CREATE INDEX `completions_day_idx` ON `completions` (`day_id`);--> statement-breakpoint
CREATE TABLE `content_variants` (
	`id` text PRIMARY KEY NOT NULL,
	`day_id` text NOT NULL,
	`kind` text NOT NULL,
	`variant_key` text NOT NULL,
	`label` text NOT NULL,
	`mode` text NOT NULL,
	`source_name` text NOT NULL,
	`source_url` text NOT NULL,
	`translation_key` text,
	`commentary_key` text,
	`body_json` text,
	`rights_confirmed` integer DEFAULT false NOT NULL,
	`rights_expires_at` text,
	`copy_allowed` integer DEFAULT false NOT NULL,
	`max_copy_verses` integer DEFAULT 0 NOT NULL,
	`published` integer DEFAULT true NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`day_id`) REFERENCES `devotional_days`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `content_variants_day_kind_key_uq` ON `content_variants` (`day_id`,`kind`,`variant_key`);--> statement-breakpoint
CREATE INDEX `content_variants_day_idx` ON `content_variants` (`day_id`);--> statement-breakpoint
CREATE TABLE `devotional_days` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`date` text NOT NULL,
	`day_order` integer NOT NULL,
	`title` text NOT NULL,
	`passage_reference` text NOT NULL,
	`source_url` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devotional_days_campaign_date_uq` ON `devotional_days` (`campaign_id`,`date`);--> statement-breakpoint
CREATE UNIQUE INDEX `devotional_days_campaign_order_uq` ON `devotional_days` (`campaign_id`,`day_order`);--> statement-breakpoint
CREATE TABLE `participants` (
	`id` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`name` text NOT NULL,
	`sort_order` integer NOT NULL,
	`role` text DEFAULT 'member' NOT NULL,
	`invite_token_hash` text NOT NULL,
	`consented_at` text,
	`active` integer DEFAULT true NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `participants_campaign_order_uq` ON `participants` (`campaign_id`,`sort_order`);--> statement-breakpoint
CREATE UNIQUE INDEX `participants_invite_hash_uq` ON `participants` (`invite_token_hash`);--> statement-breakpoint
CREATE INDEX `participants_campaign_idx` ON `participants` (`campaign_id`);--> statement-breakpoint
CREATE TABLE `sessions` (
	`token_hash` text PRIMARY KEY NOT NULL,
	`campaign_id` text NOT NULL,
	`participant_id` text,
	`role` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`expires_at` text NOT NULL,
	`revoked_at` text,
	FOREIGN KEY (`campaign_id`) REFERENCES `campaigns`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`participant_id`) REFERENCES `participants`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `sessions_participant_idx` ON `sessions` (`participant_id`);--> statement-breakpoint
CREATE INDEX `sessions_expiry_idx` ON `sessions` (`expires_at`);
--> statement-breakpoint
INSERT OR IGNORE INTO `campaigns`
  (`id`, `title`, `start_date`, `end_date`, `timezone`, `retention_delete_at`, `status`)
VALUES
  ('word-garden-2026-07', '말씀정원', '2026-07-27', '2026-08-09', 'Asia/Seoul', '2026-09-09T00:00:00+09:00', 'scheduled');
--> statement-breakpoint
INSERT OR IGNORE INTO `devotional_days`
  (`id`, `campaign_id`, `date`, `day_order`, `title`, `passage_reference`, `source_url`)
VALUES
  ('d1', 'word-garden-2026-07', '2026-07-27', 1, '이사야 9:8–10:4', '이사야 9:8–10:4', 'https://sum.su.or.kr:8888/bible/today'),
  ('d2', 'word-garden-2026-07', '2026-07-28', 2, '이사야 10:5–19', '이사야 10:5–19', 'https://sum.su.or.kr:8888/bible/today'),
  ('d3', 'word-garden-2026-07', '2026-07-29', 3, '이사야 10:20–34', '이사야 10:20–34', 'https://sum.su.or.kr:8888/bible/today'),
  ('d4', 'word-garden-2026-07', '2026-07-30', 4, '이사야 11:1–16', '이사야 11:1–16', 'https://sum.su.or.kr:8888/bible/today'),
  ('d5', 'word-garden-2026-07', '2026-07-31', 5, '이사야 12:1–6', '이사야 12:1–6', 'https://sum.su.or.kr:8888/bible/today'),
  ('d6', 'word-garden-2026-07', '2026-08-01', 6, '이사야 13:1–22', '이사야 13:1–22', 'https://sum.su.or.kr:8888/bible/today'),
  ('d7', 'word-garden-2026-07', '2026-08-02', 7, '이사야 14:1–23', '이사야 14:1–23', 'https://sum.su.or.kr:8888/bible/today'),
  ('d8', 'word-garden-2026-07', '2026-08-03', 8, '이사야 14:24–15:9', '이사야 14:24–15:9', 'https://sum.su.or.kr:8888/bible/today'),
  ('d9', 'word-garden-2026-07', '2026-08-04', 9, '이사야 16:1–14', '이사야 16:1–14', 'https://sum.su.or.kr:8888/bible/today'),
  ('d10', 'word-garden-2026-07', '2026-08-05', 10, '이사야 17:1–14', '이사야 17:1–14', 'https://sum.su.or.kr:8888/bible/today'),
  ('d11', 'word-garden-2026-07', '2026-08-06', 11, '이사야 18:1–19:15', '이사야 18:1–19:15', 'https://sum.su.or.kr:8888/bible/today'),
  ('d12', 'word-garden-2026-07', '2026-08-07', 12, '이사야 19:16–20:6', '이사야 19:16–20:6', 'https://sum.su.or.kr:8888/bible/today'),
  ('d13', 'word-garden-2026-07', '2026-08-08', 13, '이사야 21:1–17', '이사야 21:1–17', 'https://sum.su.or.kr:8888/bible/today'),
  ('d14', 'word-garden-2026-07', '2026-08-09', 14, '이사야 22:1–25', '이사야 22:1–25', 'https://sum.su.or.kr:8888/bible/today');
--> statement-breakpoint
INSERT OR IGNORE INTO `content_variants`
  (`id`, `day_id`, `kind`, `variant_key`, `label`, `mode`, `source_name`, `source_url`, `translation_key`, `commentary_key`, `body_json`, `rights_confirmed`, `rights_expires_at`, `copy_allowed`, `max_copy_verses`, `published`)
SELECT `id` || '-bible-gae', `id`, 'bible', 'gae', '개역개정', 'external', '성서유니온 오늘의 묵상', `source_url`, '개역개정', NULL, NULL, 0, NULL, 0, 0, 1
  FROM `devotional_days` WHERE `campaign_id` = 'word-garden-2026-07'
UNION ALL
SELECT `id` || '-bible-easy', `id`, 'bible', 'easy', '쉬운성경', 'external', '성서유니온 오늘의 묵상', `source_url`, '쉬운성경', NULL, NULL, 0, NULL, 0, 0, 1
  FROM `devotional_days` WHERE `campaign_id` = 'word-garden-2026-07'
UNION ALL
SELECT `id` || '-bible-new', `id`, 'bible', 'new', '새번역', 'external', '성서유니온 오늘의 묵상', `source_url`, '새번역', NULL, NULL, 0, NULL, 0, 0, 1
  FROM `devotional_days` WHERE `campaign_id` = 'word-garden-2026-07'
UNION ALL
SELECT `id` || '-commentary-daily', `id`, 'commentary', 'daily', '매일성경', 'external', '성서유니온 오늘의 묵상', `source_url`, NULL, '매일성경', NULL, 0, NULL, 0, 0, 1
  FROM `devotional_days` WHERE `campaign_id` = 'word-garden-2026-07'
UNION ALL
SELECT `id` || '-commentary-pure', `id`, 'commentary', 'pure', '매일성경 순', 'external', '성서유니온 오늘의 묵상', `source_url`, '새번역', '매일성경 순', NULL, 0, NULL, 0, 0, 1
  FROM `devotional_days` WHERE `campaign_id` = 'word-garden-2026-07';
