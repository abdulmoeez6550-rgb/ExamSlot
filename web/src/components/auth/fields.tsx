"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { EyeIcon, EyeOffIcon } from "../dashboard/icons";

const inputClass = "es-input";

type FieldProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  placeholder?: string;
  autoComplete?: string;
  type?: string;
  required?: boolean;
  disabled?: boolean;
};

function FieldShell({
  id,
  label,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-1 text-xs font-medium text-danger">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function TextField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  autoComplete,
  type = "text",
  required,
  disabled,
}: FieldProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;
  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <input
        id={id}
        name={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`${inputClass} ${error ? "border-danger" : ""}`}
      />
    </FieldShell>
  );
}

export function PasswordField({
  id,
  label,
  value,
  onChange,
  error,
  hint,
  placeholder,
  autoComplete,
  required,
  disabled,
}: FieldProps) {
  const [visible, setVisible] = useState(false);
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <FieldShell id={id} label={label} error={error} hint={hint}>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          className={`${inputClass} pr-20 ${error ? "border-danger" : ""}`}
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          disabled={disabled}
          className="absolute right-1 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-muted hover:text-ink disabled:opacity-50"
        >
          {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
          {visible ? "Hide" : "Show"}
        </button>
      </div>
    </FieldShell>
  );
}
