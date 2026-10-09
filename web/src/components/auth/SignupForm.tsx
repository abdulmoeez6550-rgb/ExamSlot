"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { InfoIcon } from "../dashboard/icons";
import { PasswordField, TextField } from "./fields";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "unavailable";

type Errors = Partial<
  Record<"studentId" | "fullName" | "email" | "password" | "confirmPassword", string>
>;

export function SignupForm() {
  const [studentId, setStudentId] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");

  const loading = status === "loading";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: Errors = {};

    if (!studentId.trim()) nextErrors.studentId = "Enter your student ID.";
    if (fullName.trim().length < 2) nextErrors.fullName = "Enter your full name.";
    if (!emailPattern.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (confirmPassword !== password) nextErrors.confirmPassword = "Passwords do not match.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus("loading");
    window.setTimeout(() => setStatus("unavailable"), 700);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate aria-busy={loading}>
      <div className="flex items-start gap-2 rounded border border-line bg-accent-soft p-3 text-xs text-accent">
        <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
        <p>
          Student accounts may be provisioned by your institution&apos;s administrator. This form
          is a preview and does not create an account or enable unrestricted registration.
        </p>
      </div>

      <TextField
        id="signup-student-id"
        label="Student ID"
        value={studentId}
        onChange={setStudentId}
        error={errors.studentId}
        placeholder="S-2026-0148"
        autoComplete="username"
        required
        disabled={loading}
      />

      <TextField
        id="signup-name"
        label="Full name"
        value={fullName}
        onChange={setFullName}
        error={errors.fullName}
        placeholder="Ayesha Khan"
        autoComplete="name"
        required
        disabled={loading}
      />

      <TextField
        id="signup-email"
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        placeholder="you@example.com"
        autoComplete="email"
        required
        disabled={loading}
      />

      <PasswordField
        id="signup-password"
        label="Password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        hint="At least 8 characters."
        placeholder="Create a password"
        autoComplete="new-password"
        required
        disabled={loading}
      />

      <PasswordField
        id="signup-confirm-password"
        label="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        placeholder="Re-enter your password"
        autoComplete="new-password"
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading} className="es-btn es-btn-primary">
        {loading ? "Creating account..." : "Create account"}
      </button>

      {status === "unavailable" && (
        <p role="status" className="flex items-start gap-2 rounded border border-line p-3 text-sm text-muted">
          <InfoIcon className="mt-0.5 h-4 w-4 shrink-0" />
          <span>
            Account creation is not available in this preview. Your details were validated in the
            browser but were <span className="font-semibold text-ink">not sent</span> anywhere and no
            account was created.
          </span>
        </p>
      )}
    </form>
  );
}
