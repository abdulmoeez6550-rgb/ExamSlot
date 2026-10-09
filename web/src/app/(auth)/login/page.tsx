import Link from "next/link";
import { logout } from "@/lib/actions/auth";
import { getSessionUser } from "@/lib/auth/dal";
import LoginForm from "./login-form";

// Reads the session cookie at request time — allowed to block.
export const instant = false;

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string | string[] }>;
}) {
  const params = await searchParams;
  const next = typeof params.next === "string" ? params.next : undefined;
  const user = await getSessionUser();

  if (user) {
    const dashboard = user.role === "admin" ? "/admin" : "/student";
    return (
      <div className="space-y-4 text-center">
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">
          Already signed in
        </h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {user.fullName || user.email} ·{" "}
          {user.role === "admin" ? "Administrator" : "Student"}
        </p>
        <Link
          href={dashboard}
          className="inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          Go to dashboard
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-zinc-600 underline underline-offset-4 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            Sign out
          </button>
        </form>
      </div>
    );
  }

  return <LoginForm next={next} />;
}
