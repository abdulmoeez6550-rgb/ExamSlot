import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { requireAdmin } from "@/lib/auth/dal";

// Reads the session cookie at request time — allowed to block (Next.js 16
// Cache Components; see docs: authentication-with-cache-components).
export const instant = false;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <nav className="flex items-center gap-4 text-sm font-medium text-zinc-900 dark:text-zinc-50">
            <Link href="/admin">ExamSlot · Admin</Link>
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-zinc-500 dark:text-zinc-400">
              {user.fullName || user.email}
            </span>
            <form action={logout}>
              <button
                type="submit"
                className="text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
