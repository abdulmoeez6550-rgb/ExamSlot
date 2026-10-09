import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 px-4 dark:bg-zinc-950">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          LoopVerse 3.0 · ExamSlot
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
          Exam date-sheet management for a multi-branch virtual university
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-zinc-600 dark:text-zinc-400">
          Admins manage branches, courses, students and exam slots. Students
          pick their branch once, get assigned 4–6 courses, choose conflict-free
          exam slots and lock a printable date sheet — all verified on the
          server.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="/login"
            className="w-full rounded-lg bg-zinc-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-zinc-700 sm:w-auto dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
          >
            Sign in
          </Link>
          <Link
            href="/forgot-password"
            className="w-full rounded-lg border border-zinc-300 px-6 py-3 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 sm:w-auto dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Forgot password
          </Link>
        </div>
      </main>
    </div>
  );
}
