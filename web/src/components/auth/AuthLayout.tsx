import type { ReactNode } from "react";
import Link from "next/link";
import { ROUTES } from "../home/routes";

const steps = [
  "Log in with your student account.",
  "Select an available slot for each course.",
  "Review and print your final date sheet.",
];

function Mark() {
  return (
    <Link href={ROUTES.home} aria-label="ExamSlot home" className="inline-flex items-center gap-2 rounded">
      <span className="grid h-8 w-8 place-items-center rounded bg-white text-accent">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="5" width="18" height="16" rx="1" />
          <path d="M3 10h18M8 3v4M16 3v4" />
        </svg>
      </span>
      <span className="text-base font-bold tracking-tight text-white">ExamSlot</span>
    </Link>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  footer: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-accent p-10 text-white lg:flex">
        <Mark />
        <div className="max-w-md">
          <h2 className="text-3xl font-bold leading-tight tracking-tight">
            Your exams and schedule, in one place.
          </h2>
          <p className="mt-4 text-accent-soft">
            ExamSlot keeps your slot selections, date sheet and change requests together so exam
            season stays organised.
          </p>
          <ol className="mt-8 flex flex-col divide-y divide-white/15 border-y border-white/15">
            {steps.map((step, index) => (
              <li key={step} className="flex items-start gap-3 py-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-white/40 text-sm font-bold">
                  {index + 1}
                </span>
                <span className="text-sm text-accent-soft">{step}</span>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-xs text-accent-soft">ExamSlot. Built for LoopVerse 3.0.</p>
      </aside>

      <main className="flex min-h-screen flex-col px-4 py-8 sm:px-6 lg:justify-center lg:px-12">
        <div className="mb-8 lg:hidden">
          <Link href={ROUTES.home} aria-label="ExamSlot home" className="inline-flex items-center gap-2 rounded">
            <span className="grid h-8 w-8 place-items-center rounded bg-accent text-white">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="5" width="18" height="16" rx="1" />
                <path d="M3 10h18M8 3v4M16 3v4" />
              </svg>
            </span>
            <span className="text-base font-bold tracking-tight text-ink">ExamSlot</span>
          </Link>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="es-card p-6 sm:p-8">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm text-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
          </div>

          <div className="mt-6 text-center text-sm text-muted">{footer}</div>

          <p className="mt-6 text-center text-xs text-muted">
            <Link href={ROUTES.home} className="rounded font-medium text-accent hover:underline">
              Back to home
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
