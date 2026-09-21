import assert from "node:assert/strict";
import { getTableConfig } from "drizzle-orm/sqlite-core";
import { sessions } from "./schema.ts";

const config = getTableConfig(sessions);
const columns = Object.fromEntries(config.columns.map((column) => [column.name, column]));

assert.equal(config.name, "sessions");
assert.deepEqual(Object.keys(columns), [
  "id",
  "category",
  "start_time",
  "end_time",
  "duration_seconds",
  "note",
]);
assert.equal(columns.id.primary, true);
assert.equal(columns.category.notNull, true);
assert.equal(columns.start_time.notNull, true);
assert.equal(columns.end_time.notNull, true);
assert.equal(columns.duration_seconds.notNull, true);
assert.equal(columns.note.notNull, false);
assert.equal(config.indexes[0]?.config.name, "idx_sessions_start_time");
assert.equal(config.checks.length, 2);

console.log("sessions schema: ok");
