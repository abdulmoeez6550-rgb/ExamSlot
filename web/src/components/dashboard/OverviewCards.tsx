import { overviewStats } from "./demo-data";
import { BookIcon, CalendarIcon, RequestIcon } from "./icons";

const cards = [
  {
    label: "Enrolled courses",
    value: overviewStats.enrolledCourses,
    caption: "Spring 2026 semester",
    Icon: BookIcon,
  },
  {
    label: "Scheduled exams",
    value: overviewStats.scheduledExams,
    caption: "Slots confirmed",
    Icon: CalendarIcon,
  },
  {
    label: "Pending requests",
    value: overviewStats.pendingRequests,
    caption: "Awaiting review",
    Icon: RequestIcon,
  },
];

export function OverviewCards() {
  return (
    <section id="overview" aria-labelledby="overview-heading" className="es-no-print scroll-mt-24">
      <h1 id="overview-heading" className="text-2xl font-bold tracking-tight">
        Welcome back, Ayesha
      </h1>
      <p className="mt-1 text-sm text-muted">
        Here is a summary of your exam schedule for Spring 2026.
      </p>

      <dl className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map(({ label, value, caption, Icon }) => (
          <div key={label} className="es-card p-5">
            <div className="flex items-center justify-between gap-3">
              <dt className="text-sm font-medium text-muted">{label}</dt>
              <span className="grid h-10 w-10 place-items-center rounded bg-accent-soft text-accent">
                <Icon className="h-5 w-5" />
              </span>
            </div>
            <dd className="mt-2 text-3xl font-bold tracking-tight">{value}</dd>
            <p className="mt-1 text-xs text-muted">{caption}</p>
          </div>
        ))}
      </dl>
    </section>
  );
}
