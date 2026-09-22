import { deleteSession, findSession, updateSession } from "@/db/sessions";
import { sessionInputSchema, sessionPatchSchema } from "@/lib/session-input";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: Context) {
  const { id } = await context.params;
  try {
    const session = await findSession(id);
    return session
      ? Response.json({ session })
      : Response.json({ error: "Session not found" }, { status: 404 });
  } catch (error) {
    console.error("Failed to load session", error);
    return Response.json({ error: "Session is temporarily unavailable" }, { status: 503 });
  }
}

export async function PATCH(request: Request, context: Context) {
  const { id } = await context.params;
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }
  const patch = sessionPatchSchema.safeParse(body);
  if (!patch.success || Object.keys(patch.data).length === 0) {
    return Response.json({ error: "Invalid session update" }, { status: 400 });
  }

  try {
    const existing = await findSession(id);
    if (!existing) return Response.json({ error: "Session not found" }, { status: 404 });

    const { id: _id, ...existingFields } = existing;
    const merged = sessionInputSchema.safeParse({ ...existingFields, ...patch.data });
    if (!merged.success) {
      return Response.json({ error: "Invalid session", details: merged.error.flatten() }, { status: 400 });
    }
    const session = await updateSession({ id, ...merged.data });
    return Response.json({ session });
  } catch (error) {
    console.error("Failed to update session", error);
    return Response.json({ error: "Session could not be updated" }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const { id } = await context.params;
  try {
    const existing = await findSession(id);
    if (!existing) return Response.json({ error: "Session not found" }, { status: 404 });
    await deleteSession(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete session", error);
    return Response.json({ error: "Session could not be deleted" }, { status: 503 });
  }
}
