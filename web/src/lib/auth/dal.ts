import { cache } from "react";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type UserRole = "admin" | "student";

export type SessionUser = {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
};

// Verifies the session with Supabase Auth (server-side, not the cookie alone)
// and loads the role from the profiles table. Memoized per request.
export const getSessionUser = cache(async (): Promise<SessionUser | null> => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return null;

  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.full_name,
    role: profile.role === "admin" ? "admin" : "student",
  };
});

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/student");
  return user;
}

export async function requireStudent(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "student") redirect("/admin");
  return user;
}
