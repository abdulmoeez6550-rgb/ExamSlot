"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import { InfoIcon } from "../dashboard/icons";
import { PasswordField, TextField } from "./fields";

type Status = "idle" | "loading" | "unavailable";

export function LoginForm() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ identifier?: string; password?: string }>({});
  const [status, setStatus] = useState<Status>("idle");

  const loading = status === "loading";

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      nextErrors.identifier = "Enter your student ID or email address.";
    }
    if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

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
          UI preview only. Secure authentication is not connected yet, so nothing is signed in and
          no credentials are stored.
        </p>
      </div>

      <TextField
        id="login-identifier"
        label="Student ID or email"
        value={identifier}
        onChange={setIdentifier}
        error={errors.identifier}
        placeholder="S-2026-0148 or you@example.com"
        autoComplete="username"
        required
        disabled={loading}
      />

      <PasswordField
        id="login-password"
        label="Password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        placeholder="Enter your password"
        autoComplete="current-password"
        required
        disabled={loading}
      />

      <button type="submit" disabled={loading} className="es-btn es-btn-primary">
        {loading ? "Signing in..." : "Sign in"}
      </button>

      {status === "unavailable" && (
        <p role="status" className="rounded border border-line p-3 text-sm text-muted">
          Authentication is not available in this preview. Your details were validated in the
          browser but were <span className="font-semibold text-ink">not sent</span> anywhere and no
          session was created. You can preview the dashboard demo from the navigation menu.
        </p>
      )}
    </form>
  );
}
