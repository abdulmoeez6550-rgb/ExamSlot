"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { ChangeRequest, EnrolledCourse } from "./demo-data";
import { RequestStatusBadge } from "./StatusBadge";
import { CheckIcon, InfoIcon } from "./icons";

export function ChangeRequests({
  requests,
  courses,
}: {
  requests: ChangeRequest[];
  courses: EnrolledCourse[];
}) {
  const [courseId, setCourseId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<ChangeRequest[]>([]);

  const allRequests = [...drafts, ...requests];

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const course = courses.find((item) => item.id === courseId);
    if (!course) {
      setError("Choose the course you want to change.");
      return;
    }
    if (reason.trim().length < 10) {
      setError("Please describe your reason in at least 10 characters.");
      return;
    }
    setError(null);
    setDrafts((prev) => [
      {
        id: `DRAFT-${prev.length + 1}`,
        courseCode: course.code,
        courseTitle: course.title,
        submittedLabel: "Draft created just now",
        status: "pending",
        remarks: "Draft only. Not submitted to the server.",
      },
      ...prev,
    ]);
    setCourseId("");
    setReason("");
  };

  return (
    <section id="requests" aria-labelledby="requests-heading" className="es-no-print mt-10 scroll-mt-24">
      <div className="grid gap-5 lg:grid-cols-5">
        <div className="lg:col-span-2">
          <div className="es-card p-5">
            <h2 id="requests-heading" className="text-lg font-semibold">
              Submit a change request
            </h2>
            <p className="mt-1 text-sm text-muted">
              Ask the examinations office to move an exam slot. Drafts stay in your browser and are
              not sent yet.
            </p>

            <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4" noValidate>
              <div>
                <label htmlFor="request-course" className="mb-1 block text-sm font-medium">
                  Course
                </label>
                <select
                  id="request-course"
                  value={courseId}
                  onChange={(event) => setCourseId(event.target.value)}
                  className="es-input"
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.code} - {course.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="request-reason" className="mb-1 block text-sm font-medium">
                  Reason
                </label>
                <textarea
                  id="request-reason"
                  value={reason}
                  onChange={(event) => setReason(event.target.value)}
                  rows={4}
                  placeholder="Explain why you need a different slot"
                  className="es-input"
                />
              </div>

              {error && (
                <p role="alert" className="text-sm font-medium text-danger">
                  {error}
                </p>
              )}

              <button type="submit" className="es-btn es-btn-primary">
                Create request draft
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="es-card">
            <div className="border-b border-line p-5">
              <h3 className="text-lg font-semibold">Your requests</h3>
              <p className="mt-1 text-sm text-muted">
                Status and remarks from the examinations office.
              </p>
            </div>

            {allRequests.length === 0 ? (
              <div className="p-10 text-center">
                <span className="mx-auto grid h-12 w-12 place-items-center rounded border border-line text-muted">
                  <InfoIcon className="h-6 w-6" />
                </span>
                <p className="mt-3 text-sm font-medium">No change requests yet</p>
                <p className="mt-1 text-sm text-muted">
                  Requests you submit will appear here with their status.
                </p>
              </div>
            ) : (
              <ul className="divide-y divide-line">
                {allRequests.map((request) => (
                  <li key={request.id} className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <p className="font-semibold">
                        {request.courseCode}{" "}
                        <span className="font-normal text-muted">{request.courseTitle}</span>
                      </p>
                      <RequestStatusBadge status={request.status} />
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {request.id} / Submitted {request.submittedLabel}
                    </p>
                    <p className="mt-2 text-sm text-muted">{request.remarks}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {drafts.length > 0 && (
            <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ok">
              <CheckIcon className="h-4 w-4" />
              {drafts.length} draft{drafts.length > 1 ? "s" : ""} created locally (demo)
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
