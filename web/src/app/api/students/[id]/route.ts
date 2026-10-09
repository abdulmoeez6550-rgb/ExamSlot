import { isSupabaseConfigured } from "../../../../lib/supabase/server";
import { deleteStudent, updateStudent, validateStudentInput } from "../../../../lib/students";

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }
  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateStudentInput(body, true);
  if (!parsed.ok) {
    return Response.json({ error: "validation_error", errors: parsed.errors }, { status: 422 });
  }

  try {
    const student = await updateStudent(id, parsed.value);
    return Response.json({ student });
  } catch (error) {
    return Response.json(
      { error: "server_error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  if (!isSupabaseConfigured()) {
    return Response.json({ error: "not_configured" }, { status: 503 });
  }
  const { id } = await ctx.params;
  try {
    await deleteStudent(id);
    return Response.json({ ok: true });
  } catch (error) {
    return Response.json(
      { error: "server_error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
