"use client";

import Link from "next/link";
import { useState } from "react";
import type { ReactNode } from "react";
import { Logo } from "../home/Logo";
import { ROUTES } from "../home/routes";

const navItems = [
  { href: ROUTES.admin, label: "Students", active: true },
  { href: ROUTES.home, label: "Back to home", active: false },
  { href: ROUTES.studentDashboard, label: "Student view", active: false },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#admin-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
          <Logo />
          <p className="mt-6 px-3 es-eyebrow">Admin console</p>
          <nav aria-label="Admin sections" className="mt-3 flex-1">
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={item.active ? "page" : undefined}
                    className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium ${
                      item.active
                        ? "bg-accent-soft text-accent"
                        : "text-muted hover:bg-accent-soft hover:text-ink"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <div className="rounded border border-line bg-paper p-3">
            <p className="text-sm font-semibold">Administrator</p>
            <p className="mt-1 text-xs text-muted">Prototype session. Not authenticated.</p>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="admin-mobile-nav"
              aria-label="Toggle admin navigation"
              className="grid h-10 w-10 place-items-center rounded border border-line text-ink"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
              </svg>
            </button>
          </header>

          {open && (
            <nav id="admin-mobile-nav" aria-label="Admin sections" className="border-b border-line bg-surface px-4 py-3 lg:hidden">
              <ul className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`block rounded px-3 py-2 text-sm font-medium ${
                        item.active ? "bg-accent-soft text-accent" : "text-ink hover:bg-accent-soft"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <main id="admin-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <div className="mb-6 flex flex-wrap items-start gap-3 rounded border border-line bg-accent-soft p-4">
              <p className="text-sm text-accent">
                <span className="font-semibold">Prototype admin console.</span> It is not protected by
                login yet and is intended for demonstration only.
              </p>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
