import { insertSession, listSessions } from "@/db/sessions";
import { sessionInputSchema } from "@/lib/session-input";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return Response.json({ sessions: await listSessions() });
  } catch (error) {
    console.error("Failed to list sessions", error);
    return Response.json({ error: "Sessions are temporarily unavailable" }, { status: 503 });
  }
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = sessionInputSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid session", details: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const session = await insertSession({ id: crypto.randomUUID(), ...parsed.data });
    return Response.json({ session }, { status: 201 });
  } catch (error) {
    console.error("Failed to create session", error);
    return Response.json({ error: "Session could not be saved" }, { status: 503 });
  }
}
