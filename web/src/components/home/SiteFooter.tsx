import Link from "next/link";
import { Logo } from "./Logo";
import { ROUTES } from "./routes";

const CURRENT_YEAR = 2026;

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div>
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted">
            ExamSlot helps students pick exam slots and view their date sheets, while administrators
            manage schedules.
          </p>
        </div>
        <nav aria-label="Footer">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-muted">
            <li><Link className="rounded hover:text-ink" href={ROUTES.home}>Home</Link></li>
            <li><Link className="rounded hover:text-ink" href={ROUTES.features}>Features</Link></li>
            <li><Link className="rounded hover:text-ink" href={ROUTES.howItWorks}>How It Works</Link></li>
            <li><Link className="rounded hover:text-ink" href={ROUTES.login}>Login</Link></li>
          </ul>
        </nav>
      </div>
      <p className="border-t border-line py-4 text-center text-xs text-muted">
        {CURRENT_YEAR} ExamSlot. Built for LoopVerse 3.0.
      </p>
    </footer>
  );
}
