"use client";

import { useMemo, useState } from "react";
import type { ExamStatus, UpcomingExam } from "./demo-data";
import { ExamStatusBadge } from "./StatusBadge";
import { SearchIcon } from "./icons";

const filters: { value: "all" | ExamStatus; label: string }[] = [
  { value: "all", label: "All statuses" },
  { value: "confirmed", label: "Confirmed" },
  { value: "pending", label: "Pending" },
  { value: "action-required", label: "Action required" },
];

export function UpcomingExams({ exams }: { exams: UpcomingExam[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<"all" | ExamStatus>("all");

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return exams.filter((exam) => {
      const matchesStatus = status === "all" || exam.status === status;
      const matchesQuery =
        needle === "" ||
        exam.courseCode.toLowerCase().includes(needle) ||
        exam.courseTitle.toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [exams, query, status]);

  return (
    <section id="upcoming" aria-labelledby="upcoming-heading" className="es-no-print mt-10 scroll-mt-24">
      <div className="es-card">
        <div className="flex flex-col gap-4 border-b border-line p-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 id="upcoming-heading" className="text-lg font-semibold">
              Upcoming exams
            </h2>
            <p className="mt-1 text-sm text-muted">Search and filter your scheduled exam sittings.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <div>
              <label htmlFor="exam-search" className="mb-1 block text-xs font-medium text-muted">
                Search course
              </label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                <input
                  id="exam-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Course code or title"
                  className="es-input pl-9 sm:w-56"
                />
              </div>
            </div>
            <div>
              <label htmlFor="exam-filter" className="mb-1 block text-xs font-medium text-muted">
                Filter by status
              </label>
              <select
                id="exam-filter"
                value={status}
                onChange={(event) => setStatus(event.target.value as "all" | ExamStatus)}
                className="es-input sm:w-44"
              >
                {filters.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm font-medium">No exams match your filters</p>
            <p className="mt-1 text-sm text-muted">
              Try a different course code or clear the status filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("all");
              }}
              className="es-btn es-btn-secondary mt-4"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <>
            <div className="hidden md:block">
              <table className="w-full border-collapse text-left text-sm">
                <caption className="sr-only">Upcoming exam schedule</caption>
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                    <th scope="col" className="px-5 py-3 font-semibold">Course</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Date</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Time</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Slot / Room</th>
                    <th scope="col" className="px-5 py-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((exam) => (
                    <tr key={exam.id} className="border-b border-line last:border-0">
                      <td className="px-5 py-4">
                        <span className="font-semibold">{exam.courseCode}</span>
                        <span className="block text-muted">{exam.courseTitle}</span>
                      </td>
                      <td className="px-5 py-4 text-muted">{exam.dateLabel}</td>
                      <td className="px-5 py-4 text-muted">{exam.timeLabel}</td>
                      <td className="px-5 py-4 text-muted">
                        {exam.slot} / {exam.room}
                      </td>
                      <td className="px-5 py-4">
                        <ExamStatusBadge status={exam.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <ul className="divide-y divide-line md:hidden">
              {filtered.map((exam) => (
                <li key={exam.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{exam.courseCode}</p>
                      <p className="text-sm text-muted">{exam.courseTitle}</p>
                    </div>
                    <ExamStatusBadge status={exam.status} />
                  </div>
                  <dl className="mt-3 grid grid-cols-2 gap-y-2 text-sm">
                    <dt className="text-muted">Date</dt>
                    <dd className="text-right text-muted">{exam.dateLabel}</dd>
                    <dt className="text-muted">Time</dt>
                    <dd className="text-right text-muted">{exam.timeLabel}</dd>
                    <dt className="text-muted">Slot / Room</dt>
                    <dd className="text-right text-muted">
                      {exam.slot} / {exam.room}
                    </dd>
                  </dl>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </section>
  );
}
