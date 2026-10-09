"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "./Logo";
import { ROUTES } from "./routes";

const links = [
  { href: ROUTES.home, label: "Home", exact: true },
  { href: ROUTES.features, label: "Features" },
  { href: ROUTES.howItWorks, label: "How It Works" },
  { href: ROUTES.studentDashboard, label: "Student Dashboard" },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string, exact = false) => {
    if (!href.startsWith("/") || href.startsWith("/#")) return false;
    const base = href.split("#")[0];
    if (exact) return pathname === base;
    return pathname === base || pathname.startsWith(`${base}/`);
  };
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const isActive = useIsActive();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-paper">
      <nav
        aria-label="Primary"
        className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6"
      >
        <Logo />

        <ul className="hidden items-center gap-7 text-sm font-medium text-muted lg:flex">
          {links.map((link) => {
            const active = isActive(link.href, link.exact);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded ${active ? "text-accent" : "hover:text-ink"}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <Link href={ROUTES.login} className="es-btn es-btn-secondary">
            Login
          </Link>
          <Link href={ROUTES.signup} className="es-btn es-btn-primary">
            Sign Up
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
          className="grid h-9 w-9 place-items-center rounded border border-line text-ink lg:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            {open ? (
              <path d="M6 6l12 12M18 6L6 18" />
            ) : (
              <path d="M4 7h16M4 12h16M4 17h16" />
            )}
          </svg>
        </button>
      </nav>

      {open && (
        <div id="mobile-menu" className="border-t border-line bg-paper lg:hidden">
          <ul className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3 sm:px-6">
            {links.map((link) => {
              const active = isActive(link.href, link.exact);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={`block rounded px-3 py-2 text-sm font-medium ${
                      active ? "bg-accent-soft text-accent" : "text-ink hover:bg-accent-soft"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-2 grid grid-cols-2 gap-2">
              <Link
                href={ROUTES.login}
                onClick={() => setOpen(false)}
                className="es-btn es-btn-secondary"
              >
                Login
              </Link>
              <Link
                href={ROUTES.signup}
                onClick={() => setOpen(false)}
                className="es-btn es-btn-primary"
              >
                Sign Up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
