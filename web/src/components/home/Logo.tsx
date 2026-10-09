import Link from "next/link";
import { ROUTES } from "./routes";

type LogoProps = {
  className?: string;
  showWordmark?: boolean;
};

export function Logo({ className = "", showWordmark = true }: LogoProps) {
  return (
    <Link
      href={ROUTES.home}
      aria-label="ExamSlot home"
      className={`inline-flex items-center gap-2 rounded ${className}`}
    >
      <span className="grid h-8 w-8 place-items-center rounded bg-accent text-white">
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
      {showWordmark && (
        <span className="text-base font-bold tracking-tight text-ink">
          Exam<span className="text-accent">Slot</span>
        </span>
      )}
    </Link>
  );
}
