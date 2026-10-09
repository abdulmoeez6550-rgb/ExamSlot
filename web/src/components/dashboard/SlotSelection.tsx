"use client";

import { useState } from "react";
import type { CourseSlotOptions } from "./demo-data";
import { CheckIcon } from "./icons";

export function SlotSelection({ courses }: { courses: CourseSlotOptions[] }) {
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [confirmed, setConfirmed] = useState<Record<string, boolean>>({});

  if (courses.length === 0) {
    return (
      <section id="slots" aria-labelledby="slots-heading" className="es-no-print mt-10 scroll-mt-24">
        <div className="es-card p-8 text-center">
          <h2 id="slots-heading" className="text-lg font-semibold">
            Course slot selection
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Nothing to pick right now. You will see a course here when an administrator opens a slot
            selection window for it.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="slots" aria-labelledby="slots-heading" className="es-no-print mt-10 scroll-mt-24">
      <div className="es-card p-5">
        <h2 id="slots-heading" className="text-lg font-semibold">
          Course slot selection
        </h2>
        <p className="mt-1 text-sm text-muted">
          Pick an available exam slot for each course below. Confirmations on this page are local to
          your browser and are not submitted to the server yet.
        </p>

        <div className="mt-5 flex flex-col gap-5">
          {courses.map((course) => {
            const isConfirmed = confirmed[course.courseId];
            const selected = selections[course.courseId];
            return (
              <fieldset
                key={course.courseId}
                className="rounded border border-line p-4"
                disabled={isConfirmed}
              >
                <legend className="px-1 text-sm font-semibold">
                  {course.courseCode} <span className="font-normal text-muted">{course.courseTitle}</span>
                </legend>

                <div className="mt-3 grid gap-2 sm:grid-cols-3">
                  {course.options.map((option) => {
                    const full = option.seatsLeft <= 0;
                    const id = `${course.courseId}-${option.id}`;
                    return (
                      <label
                        key={option.id}
                        htmlFor={id}
                        className={`flex cursor-pointer flex-col rounded border p-3 text-sm ${
                          full
                            ? "cursor-not-allowed border-line bg-paper text-muted"
                            : selected === option.id
                              ? "border-accent bg-accent-soft"
                              : "border-line hover:border-accent"
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <input
                            id={id}
                            type="radio"
                            name={course.courseId}
                            value={option.id}
                            disabled={full}
                            checked={selected === option.id}
                            onChange={() =>
                              setSelections((prev) => ({ ...prev, [course.courseId]: option.id }))
                            }
                            className="h-4 w-4 accent-[var(--accent)]"
                          />
                          <span className="font-semibold">{option.label}</span>
                        </span>
                        <span className="mt-1 text-muted">{option.time}</span>
                        <span className="text-xs text-muted">{option.venue}</span>
                        <span className={`mt-1 text-xs font-medium ${full ? "text-danger" : "text-ok"}`}>
                          {full ? "No seats left" : `${option.seatsLeft} seats left`}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    disabled={!selected || isConfirmed}
                    onClick={() => setConfirmed((prev) => ({ ...prev, [course.courseId]: true }))}
                    className="es-btn es-btn-primary"
                  >
                    {isConfirmed ? "Selection saved" : "Confirm slot"}
                  </button>
                  {isConfirmed && (
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ok">
                      <CheckIcon className="h-4 w-4" />
                      Saved locally (demo)
                    </span>
                  )}
                </div>
              </fieldset>
            );
          })}
        </div>
      </div>
    </section>
  );
}
