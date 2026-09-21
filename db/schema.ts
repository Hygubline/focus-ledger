import { check, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
export const SESSION_CATEGORIES = [
  "HVAC",
  "Programming",
  "Reading",
  "Exercise",
  "Meditation",
  "Gaming",
  "Other",
] as const; 
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    category: text("category",{ enum: SESSION_CATEGORIES }).notNull(),
    startTime: integer("start_time", { mode: "timestamp_ms" }).notNull(),
    endTime: integer("end_time", { mode: "timestamp_ms" }).notNull(),
    durationSeconds: integer("duration_seconds").notNull(),
    note: text("note"),
  },
  (table) => [
    index("idx_sessions_start_time").on(table.startTime),
    check("sessions_end_after_start", sql`${table.endTime} > ${table.startTime}`),
    check("sessions_duration_non_negative", sql`${table.durationSeconds} >= 0`),
  ],
);

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
