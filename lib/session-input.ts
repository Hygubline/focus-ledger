import { z } from "zod";
import { SESSION_CATEGORIES } from "../db/schema.ts";

const sessionFields = z.object({
  category: z.enum(SESSION_CATEGORIES),
  startTime: z.number().int().positive(),
  endTime: z.number().int().positive(),
  durationSeconds: z.number().int().nonnegative(),
  note: z.string().max(2000).nullable().optional(),
}).strict();

export const sessionInputSchema = sessionFields.superRefine((session, context) => {
  if (session.endTime <= session.startTime) {
    context.addIssue({ code: "custom", path: ["endTime"], message: "End time must be after start time" });
  }
  if (session.durationSeconds > Math.ceil((session.endTime - session.startTime) / 1000)) {
    context.addIssue({ code: "custom", path: ["durationSeconds"], message: "Duration cannot exceed elapsed time" });
  }
});

export const sessionPatchSchema = sessionFields.partial().strict();
