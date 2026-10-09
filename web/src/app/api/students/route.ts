import { isSupabaseConfigured } from "../../../lib/supabase/server";
import {
  createStudent,
  listStudents,
  validateStudentInput,
  type StudentInput,
} from "../../../lib/students";

const notConfigured = () =>
  Response.json(
    {
      error: "not_configured",
      message:
        "Supabase is not configured. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to web/.env.local, then run web/supabase/schema.sql.",
    },
    { status: 503 },
  );

export async function GET() {
  if (!isSupabaseConfigured()) return notConfigured();
  try {
    const students = await listStudents();
    return Response.json({ students });
  } catch (error) {
    return Response.json(
      { error: "server_error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  if (!isSupabaseConfigured()) return notConfigured();
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_request", message: "Invalid JSON body." }, { status: 400 });
  }

  const parsed = validateStudentInput(body, false);
  if (!parsed.ok) {
    return Response.json({ error: "validation_error", errors: parsed.errors }, { status: 422 });
  }

  try {
    const student = await createStudent(parsed.value as StudentInput);
    return Response.json({ student }, { status: 201 });
  } catch (error) {
    return Response.json(
      { error: "server_error", message: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
