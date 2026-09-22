import { getD1 } from "./index";
import type { Session } from "./schema";

export type ApiSession = {
  id: string;
  category: Session["category"];
  startTime: number;
  endTime: number;
  durationSeconds: number;
  note: string | null;
};

type SessionRow = {
  id: string;
  category: Session["category"];
  start_time: number;
  end_time: number;
  duration_seconds: number;
  note: string | null;
};

const columns = "id, category, start_time, end_time, duration_seconds, note";

function fromRow(row: SessionRow): ApiSession {
  return {
    id: row.id,
    category: row.category,
    startTime: row.start_time,
    endTime: row.end_time,
    durationSeconds: row.duration_seconds,
    note: row.note,
  };
}

export async function listSessions() {
  const result = await getD1().prepare(`SELECT ${columns} FROM sessions ORDER BY start_time DESC`).all<SessionRow>();
  return (result.results ?? []).map(fromRow);
}

export async function findSession(id: string) {
  const row = await getD1().prepare(`SELECT ${columns} FROM sessions WHERE id = ?`).bind(id).first<SessionRow>();
  return row ? fromRow(row) : null;
}

export async function insertSession(session: {
  id: string;
  category: Session["category"];
  startTime: number;
  endTime: number;
  durationSeconds: number;
  note?: string | null;
}) {
  await getD1().prepare(
    "INSERT INTO sessions (id, category, start_time, end_time, duration_seconds, note) VALUES (?, ?, ?, ?, ?, ?)",
  ).bind(session.id, session.category, session.startTime, session.endTime, session.durationSeconds, session.note ?? null).run();
  return findSession(session.id);
}

export async function updateSession(session: {
  id: string;
  category: Session["category"];
  startTime: number;
  endTime: number;
  durationSeconds: number;
  note?: string | null;
}) {
  await getD1().prepare(
    "UPDATE sessions SET category = ?, start_time = ?, end_time = ?, duration_seconds = ?, note = ? WHERE id = ?",
  ).bind(session.category, session.startTime, session.endTime, session.durationSeconds, session.note ?? null, session.id).run();
  return findSession(session.id);
}

export async function deleteSession(id: string) {
  await getD1().prepare("DELETE FROM sessions WHERE id = ?").bind(id).run();
}
