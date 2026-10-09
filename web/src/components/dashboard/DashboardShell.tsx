"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Logo } from "../home/Logo";
import { ROUTES } from "../home/routes";
import { studentProfile } from "./demo-data";
import {
  BookIcon,
  CalendarIcon,
  CloseIcon,
  DocumentIcon,
  HomeIcon,
  MenuIcon,
  OverviewIcon,
  RequestIcon,
} from "./icons";

type NavItem = {
  id: string;
  label: string;
  Icon: (props: { className?: string }) => ReactNode;
};

const navItems: NavItem[] = [
  { id: "overview", label: "Overview", Icon: OverviewIcon },
  { id: "upcoming", label: "Upcoming exams", Icon: CalendarIcon },
  { id: "slots", label: "Course slots", Icon: BookIcon },
  { id: "datesheet", label: "Date sheet", Icon: DocumentIcon },
  { id: "requests", label: "Change requests", Icon: RequestIcon },
];

const navIds = navItems.map((item) => item.id);

function useScrollSpy(ids: string[], offset = 140) {
  const [active, setActive] = useState(ids[0] ?? "");

  useEffect(() => {
    const onScroll = () => {
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top <= offset) {
          current = id;
        }
      }
      setActive(current);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [ids, offset]);

  return active;
}

function NavLinks({ active, onNavigate }: { active: string; onNavigate?: () => void }) {
  return (
    <ul className="flex flex-col gap-1">
      {navItems.map(({ id, label, Icon }) => {
        const isActive = active === id;
        return (
          <li key={id}>
            <a
              href={`#${id}`}
              onClick={onNavigate}
              aria-current={isActive ? "location" : undefined}
              className={`flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium ${
                isActive ? "bg-accent-soft text-accent" : "text-muted hover:bg-accent-soft hover:text-ink"
              }`}
            >
              <Icon className="h-5 w-5 shrink-0" />
              {label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

function ProfileCard() {
  const initials = studentProfile.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="rounded border border-line bg-paper p-3">
      <div className="flex items-center gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded bg-accent text-sm font-bold text-white">
          {initials}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{studentProfile.name}</p>
          <p className="truncate text-xs text-muted">{studentProfile.studentId}</p>
        </div>
      </div>
      <p className="mt-3 truncate text-xs text-muted">{studentProfile.program}</p>
    </div>
  );
}

export function DashboardShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const active = useScrollSpy(navIds);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#dashboard-main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>

      <div className="mx-auto flex w-full max-w-7xl">
        <aside className="es-no-print sticky top-0 hidden h-screen w-72 shrink-0 flex-col border-r border-line bg-surface px-4 py-6 lg:flex">
          <Logo />
          <p className="mt-6 px-3 es-eyebrow">Student portal</p>
          <nav aria-label="Dashboard sections" className="mt-3 flex-1">
            <NavLinks active={active} />
          </nav>
          <ProfileCard />
          <Link
            href={ROUTES.home}
            className="mt-3 flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted hover:bg-accent-soft hover:text-ink"
          >
            <HomeIcon className="h-5 w-5" />
            Back to home
          </Link>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="es-no-print sticky top-0 z-40 flex items-center justify-between gap-3 border-b border-line bg-surface px-4 py-3 lg:hidden">
            <Logo />
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={open}
              aria-controls="dashboard-mobile-nav"
              aria-label="Open dashboard navigation"
              className="grid h-10 w-10 place-items-center rounded border border-line text-ink"
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </header>

          <main id="dashboard-main" className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
            <div className="es-no-print mb-6 flex flex-wrap items-start gap-3 rounded border border-line bg-accent-soft p-4">
              <p className="text-sm text-accent">
                <span className="font-semibold">Demo data.</span> This dashboard is not yet connected
                to the ExamSlot backend. Slot choices, date sheets and change requests shown here are
                samples and are not saved anywhere.
              </p>
            </div>
            {children}
          </main>
        </div>
      </div>

      {open && (
        <div className="es-no-print fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            aria-label="Close navigation"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40"
          />
          <div
            id="dashboard-mobile-nav"
            role="dialog"
            aria-modal="true"
            aria-label="Dashboard navigation"
            className="absolute inset-y-0 left-0 flex w-72 max-w-[85%] flex-col overflow-y-auto border-r border-line bg-surface px-4 py-5"
          >
            <div className="flex items-center justify-between">
              <Logo />
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close dashboard navigation"
                className="grid h-10 w-10 place-items-center rounded border border-line text-ink"
              >
                <CloseIcon className="h-5 w-5" />
              </button>
            </div>
            <nav aria-label="Dashboard sections" className="mt-6 flex-1">
              <NavLinks active={active} onNavigate={() => setOpen(false)} />
            </nav>
            <ProfileCard />
            <Link
              href={ROUTES.home}
              onClick={() => setOpen(false)}
              className="mt-3 flex items-center gap-3 rounded px-3 py-2.5 text-sm font-medium text-muted hover:bg-accent-soft hover:text-ink"
            >
              <HomeIcon className="h-5 w-5" />
              Back to home
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
