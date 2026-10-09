"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type StudentStatus = "active" | "inactive" | "pending";

type Student = {
  id: string;
  student_id: string;
  full_name: string;
  email: string;
  program: string | null;
  semester: string | null;
  status: StudentStatus;
  created_at: string;
};

const emptyForm = { student_id: "", full_name: "", email: "", program: "", semester: "" };

const statusStyles: Record<StudentStatus, string> = {
  active: "text-ok",
  pending: "text-warn",
  inactive: "text-muted",
};

export function StudentsManager({ configured }: { configured: boolean }) {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(configured);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/students", { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Could not load students.");
      setStudents(data.students ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load students.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!configured) return;
    const timer = setTimeout(() => void load(), 0);
    return () => clearTimeout(timer);
  }, [configured, load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.student_id, s.full_name, s.email, s.program ?? "", s.semester ?? ""]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [students, query]);

  async function addStudent(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setFormError(null);
    try {
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.errors?.join(" ") ?? data.message ?? "Could not add student.");
      }
      setForm(emptyForm);
      await load();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not add student.");
    } finally {
      setSaving(false);
    }
  }

  async function changeStatus(id: string, status: StudentStatus) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Could not update status.");
      }
      setStudents((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update status.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message ?? "Could not delete student.");
      }
      setStudents((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete student.");
    } finally {
      setBusyId(null);
    }
  }

  if (!configured) {
    return (
      <div className="es-card p-6">
        <h2 className="text-lg font-semibold">Database not configured</h2>
        <p className="mt-2 text-sm text-muted">The student records store is not connected yet. To enable it:</p>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-muted">
          <li>Create a Supabase project.</li>
          <li>Run <code className="rounded bg-paper px-1.5 py-0.5">web/supabase/schema.sql</code> in the SQL editor.</li>
          <li>Copy <code className="rounded bg-paper px-1.5 py-0.5">web/.env.local.example</code> to <code className="rounded bg-paper px-1.5 py-0.5">web/.env.local</code> and add your project URL and service role key.</li>
          <li>Restart the dev server.</li>
        </ol>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <section className="es-card p-5 sm:p-6">
        <h2 className="text-lg font-semibold">Add a student</h2>
        <form onSubmit={addStudent} className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(
            [
              ["student_id", "Student ID", true],
              ["full_name", "Full name", true],
              ["email", "Email", true],
              ["program", "Program", false],
              ["semester", "Semester", false],
            ] as const
          ).map(([key, label, required]) => (
            <label key={key} className="block text-sm font-medium">
              {label}
              <input
                type={key === "email" ? "email" : "text"}
                required={required}
                value={form[key]}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                className="es-input mt-1"
              />
            </label>
          ))}
          <div className="flex items-end">
            <button type="submit" disabled={saving} className="es-btn es-btn-primary w-full">
              {saving ? "Saving..." : "Add student"}
            </button>
          </div>
        </form>
        {formError && <p className="mt-3 text-sm text-danger">{formError}</p>}
      </section>

      <section className="es-card p-5 sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-lg font-semibold">
            Students <span className="text-sm font-normal text-muted">({students.length})</span>
          </h2>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search students..."
            className="es-input sm:w-64"
          />
        </div>

        {error && <p className="mt-3 rounded border border-danger px-3 py-2 text-sm text-danger">{error}</p>}

        {loading ? (
          <p className="mt-6 text-sm text-muted">Loading students...</p>
        ) : filtered.length === 0 ? (
          <p className="mt-6 text-sm text-muted">
            {students.length === 0 ? "No students saved yet. Add one above." : "No students match your search."}
          </p>
        ) : (
          <div className="-mx-2 mt-4 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead>
                <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                  <th className="px-2 py-2 font-semibold">Student</th>
                  <th className="px-2 py-2 font-semibold">Program</th>
                  <th className="px-2 py-2 font-semibold">Status</th>
                  <th className="px-2 py-2 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-b border-line last:border-0">
                    <td className="px-2 py-3">
                      <p className="font-medium">{s.full_name}</p>
                      <p className="text-xs text-muted">{s.student_id} / {s.email}</p>
                    </td>
                    <td className="px-2 py-3 text-muted">
                      {s.program || "Not set"}
                      {s.semester ? <span className="text-muted"> / {s.semester}</span> : null}
                    </td>
                    <td className="px-2 py-3">
                      <span className={`es-badge ${statusStyles[s.status]}`}>{s.status}</span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <select
                          value={s.status}
                          disabled={busyId === s.id}
                          onChange={(e) => changeStatus(s.id, e.target.value as StudentStatus)}
                          aria-label={`Change status for ${s.full_name}`}
                          className="es-input w-auto px-2 py-1.5 text-xs"
                        >
                          <option value="active">active</option>
                          <option value="pending">pending</option>
                          <option value="inactive">inactive</option>
                        </select>
                        <button
                          type="button"
                          disabled={busyId === s.id}
                          onClick={() => remove(s.id)}
                          className="es-btn es-btn-secondary px-2.5 py-1.5 text-xs text-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
