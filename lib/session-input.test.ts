import assert from "node:assert/strict";
import { sessionInputSchema, sessionPatchSchema } from "./session-input.ts";

const valid = {
  category: "Programming",
  startTime: 1_000_000,
  endTime: 1_120_000,
  durationSeconds: 90,
  note: "Focus block",
};

assert.equal(sessionInputSchema.safeParse(valid).success, true);
assert.equal(sessionInputSchema.safeParse({ ...valid, category: "Marketing" }).success, true);
assert.equal(sessionInputSchema.safeParse({ ...valid, durationSeconds: 121 }).success, false);
assert.equal(sessionInputSchema.safeParse({ ...valid, endTime: valid.startTime }).success, false);
assert.equal(sessionPatchSchema.safeParse({ note: null }).success, true);
assert.equal(sessionPatchSchema.safeParse({ category: "Unknown" }).success, false);

console.log("session API input: ok");
