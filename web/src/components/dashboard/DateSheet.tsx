"use client";

import { studentProfile, type DateSheetEntry } from "./demo-data";
import { PrinterIcon } from "./icons";

export function DateSheet({ entries }: { entries: DateSheetEntry[] }) {
  const handlePrint = () => {
    if (typeof window !== "undefined") window.print();
  };

  return (
    <section id="datesheet" aria-labelledby="datesheet-heading" className="mt-10 scroll-mt-24">
      <div className="es-print-area es-card">
        <div className="es-no-print flex flex-col gap-3 border-b border-line p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 id="datesheet-heading" className="text-lg font-semibold">
              Personal date sheet
            </h2>
            <p className="mt-1 text-sm text-muted">
              Print or save this as a PDF. Printing includes only this date sheet.
            </p>
          </div>
          <button
            type="button"
            onClick={handlePrint}
            disabled={entries.length === 0}
            className="es-btn es-btn-secondary"
          >
            <PrinterIcon className="h-4 w-4" />
            Print date sheet
          </button>
        </div>

        <div className="p-5">
          <div className="mb-4 border-b border-line pb-4">
            <p className="text-sm font-semibold">{studentProfile.name}</p>
            <p className="text-xs text-muted">
              {studentProfile.studentId} / {studentProfile.program} / {studentProfile.semester}
            </p>
          </div>

          {entries.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted">
              Your date sheet is empty. Confirmed exams will appear here once slots are assigned.
            </p>
          ) : (
            <>
              <table className="hidden w-full border-collapse text-left text-sm sm:table">
                <caption className="sr-only">Personal exam date sheet</caption>
                <thead>
                  <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
                    <th scope="col" className="py-3 pr-4 font-semibold">Course</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Date</th>
                    <th scope="col" className="py-3 pr-4 font-semibold">Time</th>
                    <th scope="col" className="py-3 font-semibold">Room</th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry) => (
                    <tr key={entry.id} className="border-b border-line last:border-0">
                      <td className="py-3 pr-4">
                        <span className="font-semibold">{entry.courseCode}</span>
                        <span className="block text-muted">{entry.courseTitle}</span>
                      </td>
                      <td className="py-3 pr-4 text-muted">{entry.dateLabel}</td>
                      <td className="py-3 pr-4 text-muted">{entry.timeLabel}</td>
                      <td className="py-3 text-muted">{entry.room}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <ul className="flex flex-col gap-3 sm:hidden">
                {entries.map((entry) => (
                  <li key={entry.id} className="rounded border border-line p-4">
                    <p className="font-semibold">{entry.courseCode}</p>
                    <p className="text-sm text-muted">{entry.courseTitle}</p>
                    <p className="mt-2 text-sm text-muted">{entry.dateLabel}</p>
                    <p className="text-sm text-muted">
                      {entry.timeLabel} / {entry.room}
                    </p>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
