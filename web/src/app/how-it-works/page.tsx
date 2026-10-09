import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "../../components/home/Navbar";
import { SiteFooter } from "../../components/home/SiteFooter";
import { steps } from "../../components/home/content";
import { ROUTES } from "../../components/home/routes";

export const metadata: Metadata = {
  title: "How It Works | ExamSlot",
  description:
    "Log in, choose your exam slots, and get your printable date sheet in three steps.",
};

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main id="main">
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
            <p className="es-eyebrow">How it works</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              From login to date sheet in three steps
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              No paperwork and no guesswork. Here is the full journey.
            </p>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <ol className="grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="es-card p-6">
                  <span className="grid h-8 w-8 place-items-center rounded bg-accent text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <h2 className="mt-4 font-semibold">{s.title}</h2>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href={ROUTES.login} className="es-btn es-btn-primary">
                Access my schedule
              </Link>
              <Link href={ROUTES.features} className="es-btn es-btn-secondary">
                Explore features
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
