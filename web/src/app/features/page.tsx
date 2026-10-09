import Link from "next/link";
import type { Metadata } from "next";
import { Navbar } from "../../components/home/Navbar";
import { SiteFooter } from "../../components/home/SiteFooter";
import { features } from "../../components/home/content";
import { ROUTES } from "../../components/home/routes";

export const metadata: Metadata = {
  title: "Features | ExamSlot",
  description:
    "Slot selection, personal date sheets, conflict checks, change requests and admin tools for exam season.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Navbar />
      <main id="main">
        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:py-20">
            <p className="es-eyebrow">Features</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Everything you need for exam season
            </h1>
            <p className="mt-4 max-w-2xl text-lg text-muted">
              Built for students and administrators alike, from first login to the printed date
              sheet.
            </p>
          </div>
        </section>

        <section className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
            <dl className="grid gap-x-12 gap-y-8 md:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="border-t border-line pt-5">
                  <dt className="font-semibold">{f.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{f.text}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-12 flex flex-wrap gap-3">
              <Link href={ROUTES.howItWorks} className="es-btn es-btn-primary">
                See how it works
              </Link>
              <Link href={ROUTES.login} className="es-btn es-btn-secondary">
                Student login
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
