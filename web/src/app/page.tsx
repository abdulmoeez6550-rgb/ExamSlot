import Link from "next/link";
import { Navbar } from "../components/home/Navbar";
import { SiteFooter } from "../components/home/SiteFooter";
import { ROUTES } from "../components/home/routes";
import { features, steps } from "../components/home/content";

export default function Home() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:border focus:border-line focus:bg-surface focus:px-4 focus:py-2"
      >
        Skip to content
      </a>
      <Navbar />

      <main id="main">
        <section id="home" className="border-b border-line">
          <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
            <div className="lg:col-span-7">
              <p className="es-eyebrow">LoopVerse 3.0</p>
              <h1 className="mt-4 max-w-2xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
                Exam scheduling without the guesswork.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
                Students choose from available exam slots and get a clean, printable date sheet.
                Administrators manage the schedules behind the scenes.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={ROUTES.login} className="es-btn es-btn-primary">
                  Student login
                </Link>
                <Link href={ROUTES.features} className="es-btn es-btn-secondary">
                  Explore features
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="es-card p-6">
                <p className="es-eyebrow">The process</p>
                <ol className="mt-4 flex flex-col divide-y divide-line">
                  {steps.map((s, i) => (
                    <li key={s.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded border border-line text-xs font-bold text-accent">
                        {i + 1}
                      </span>
                      <div>
                        <p className="font-semibold">{s.title}</p>
                        <p className="mt-0.5 text-sm text-muted">{s.text}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="border-b border-line">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-2xl">
              <p className="es-eyebrow">Features</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Everything you need for exam season
              </h2>
              <p className="mt-3 text-muted">
                Built for students and administrators alike.
              </p>
            </div>
            <dl className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
              {features.map((f) => (
                <div key={f.title} className="border-t border-line pt-5">
                  <dt className="font-semibold">{f.title}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{f.text}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <Link href={ROUTES.features} className="es-btn es-btn-secondary">
                See all features
              </Link>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-b border-line bg-surface">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="max-w-2xl">
              <p className="es-eyebrow">How it works</p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                From login to date sheet
              </h2>
            </div>
            <ol className="mt-10 grid gap-6 md:grid-cols-3">
              {steps.map((s, i) => (
                <li key={s.title} className="es-card p-6">
                  <span className="grid h-8 w-8 place-items-center rounded bg-accent text-sm font-bold text-white">
                    {i + 1}
                  </span>
                  <p className="mt-4 font-semibold">{s.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="about">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
            <div className="rounded border border-line bg-accent px-6 py-12 text-center text-white sm:px-12">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Ready to see your exam schedule?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-accent-soft">
                Sign in to choose your slots and get your date sheet sorted before exam season
                starts.
              </p>
              <Link
                href={ROUTES.login}
                className="es-btn mt-8 bg-white text-accent"
              >
                Access my schedule
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
