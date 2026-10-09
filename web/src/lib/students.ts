import { getSupabaseServerClient } from "./supabase/server";

export type StudentStatus = "active" | "inactive" | "pending";

export interface StudentRecord {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  program: string | null;
  semester: string | null;
  status: StudentStatus;
  created_at: string;
  updated_at: string;
}

export interface StudentInput {
  student_id: string;
  full_name: string;
  email: string;
  program?: string | null;
  semester?: string | null;
  status?: StudentStatus;
}

const TABLE = "students";
const STATUSES: StudentStatus[] = ["active", "inactive", "pending"];

function unwrap<T>(result: { data: T | null; error: { message: string } | null }): T {
  if (result.error) throw new Error(result.error.message);
  if (result.data == null) throw new Error("Supabase returned no data.");
  return result.data;
}

export function validateStudentInput(
  raw: unknown,
  partial = false,
): { ok: true; value: Partial<StudentInput> } | { ok: false; errors: string[] } {
  const errors: string[] = [];
  const body = (raw ?? {}) as Record<string, unknown>;

  const str = (key: string) => (typeof body[key] === "string" ? (body[key] as string).trim() : "");

  const student_id = str("student_id");
  const full_name = str("full_name");
  const email = str("email");
  const program = str("program");
  const semester = str("semester");
  const statusRaw = str("status");
  const status = STATUSES.includes(statusRaw as StudentStatus)
    ? (statusRaw as StudentStatus)
    : undefined;

  if (!partial || body.student_id !== undefined) {
    if (!student_id) errors.push("student_id is required.");
  }
  if (!partial || body.full_name !== undefined) {
    if (!full_name) errors.push("full_name is required.");
  }
  if (!partial || body.email !== undefined) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push("A valid email is required.");
  }
  if (body.status !== undefined && !status) {
    errors.push("status must be one of active, inactive, pending.");
  }

  if (errors.length > 0) return { ok: false, errors };

  const value: Partial<StudentInput> = {};
  if (!partial || body.student_id !== undefined) value.student_id = student_id;
  if (!partial || body.full_name !== undefined) value.full_name = full_name;
  if (!partial || body.email !== undefined) value.email = email;
  if (!partial || body.program !== undefined) value.program = program || null;
  if (!partial || body.semester !== undefined) value.semester = semester || null;
  if (body.status !== undefined) value.status = status;
  else if (!partial) value.status = "active";

  return { ok: true, value };
}

export async function listStudents(): Promise<StudentRecord[]> {
  const supabase = getSupabaseServerClient();
  const result = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
  return (unwrap(result as never) as StudentRecord[]) ?? [];
}

export async function createStudent(input: StudentInput): Promise<StudentRecord> {
  const supabase = getSupabaseServerClient();
  const result = await supabase.from(TABLE).insert(input).select().single();
  return unwrap(result as never) as StudentRecord;
}

export async function updateStudent(
  id: string,
  input: Partial<StudentInput>,
): Promise<StudentRecord> {
  const supabase = getSupabaseServerClient();
  const result = await supabase.from(TABLE).update(input).eq("id", id).select().single();
  return unwrap(result as never) as StudentRecord;
}

export async function deleteStudent(id: string): Promise<void> {
  const supabase = getSupabaseServerClient();
  const result = await supabase.from(TABLE).delete().eq("id", id);
  if (result.error) throw new Error(result.error.message);
}
