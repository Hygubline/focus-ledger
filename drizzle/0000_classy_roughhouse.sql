CREATE TABLE `sessions` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`start_time` integer NOT NULL,
	`end_time` integer NOT NULL,
	`duration_seconds` integer NOT NULL,
	`note` text,
	CONSTRAINT "sessions_end_after_start" CHECK("sessions"."end_time" > "sessions"."start_time"),
	CONSTRAINT "sessions_duration_non_negative" CHECK("sessions"."duration_seconds" >= 0)
);
--> statement-breakpoint
CREATE INDEX `idx_sessions_start_time` ON `sessions` (`start_time`);