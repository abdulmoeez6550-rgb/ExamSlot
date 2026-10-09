import type { Metadata } from "next";
import { AdminShell } from "../../../components/admin/AdminShell";
import { StudentsManager } from "../../../components/admin/StudentsManager";
import { isSupabaseConfigured } from "../../../lib/supabase/server";

export const metadata: Metadata = {
  title: "Admin · ExamSlot",
  description: "Prototype admin console for managing student records.",
};

export default function AdminDashboardPage() {
  const configured = isSupabaseConfigured();

  return (
    <AdminShell>
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">Student records</h1>
        <p className="mt-1 text-sm text-slate-600">
          Create and manage student records stored in the Supabase database.
          {!configured && " Connect Supabase to enable saving."}
        </p>
      </div>
      <StudentsManager configured={configured} />
    </AdminShell>
  );
}
