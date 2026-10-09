"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

export type AuthFormState = {
  error?: string;
  message?: string;
} | undefined;

const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .pipe(z.email({ error: "Enter a valid email address." }));

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Password is required."),
  next: z.string().optional(),
});

const resetRequestSchema = z.object({ email: emailSchema });

const passwordUpdateSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .regex(/[a-zA-Z]/, "Include at least one letter.")
      .regex(/[0-9]/, "Include at least one number."),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    error: "Passwords do not match.",
  });

function safeRedirectPath(next: string | undefined, role: "admin" | "student"): string {
  const home = role === "admin" ? "/admin" : "/student";
  if (!next || !next.startsWith("/") || next.startsWith("//")) return home;
  if (role === "student" && next.startsWith("/admin")) return home;
  if (role === "admin" && next.startsWith("/student")) return home;
  return next;
}

function firstIssue(error: z.ZodError, fallback: string): string {
  return error.issues[0]?.message ?? fallback;
}

export async function login(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    next: formData.get("next") ?? undefined,
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error, "Invalid input.") };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("Invalid login credentials")) {
      return { error: "Incorrect email or password." };
    }
    if (error.message.includes("Email not confirmed")) {
      return { error: "Confirm your email address before signing in." };
    }
    return { error: `Sign-in failed: ${error.message}` };
  }

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  const { data: profile } = authUser
    ? await supabase
        .from("profiles")
        .select("id, role")
        .eq("id", authUser.id)
        .maybeSingle()
    : { data: null };

  if (!authUser || !profile) {
    await supabase.auth.signOut();
    return {
      error:
        "This account has no provisioned profile. Ask the administrator to set it up.",
    };
  }

  const role = profile.role === "admin" ? "admin" : "student";
  redirect(safeRedirectPath(parsed.data.next, role));
}

export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

export async function requestPasswordReset(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = resetRequestSchema.safeParse({ email: formData.get("email") });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error, "Invalid input.") };
  }

  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${appUrl}/reset-password`,
  });

  if (error) {
    return { error: `Could not send the reset email: ${error.message}` };
  }

  // Never reveal whether the email exists.
  return {
    message:
      "If an account exists for that email, a password reset link has been sent.",
  };
}

export async function updatePassword(
  _prev: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = passwordUpdateSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm"),
  });

  if (!parsed.success) {
    return { error: firstIssue(parsed.error, "Invalid input.") };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({
    password: parsed.data.password,
  });

  if (error) {
    if (error.message.includes("session")) {
      return {
        error:
          "Your reset link is invalid or expired. Request a new one from the forgot-password page.",
      };
    }
    return { error: `Could not update the password: ${error.message}` };
  }

  return { message: "Password updated. You can now sign in." };
}
