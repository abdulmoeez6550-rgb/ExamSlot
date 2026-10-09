const rows = [
  {
    code: "CS-301",
    title: "Data Structures",
    date: "Mon, 12 May",
    slot: "Slot A · 09:00",
    status: "Confirmed",
  },
  {
    code: "CS-305",
    title: "Operating Systems",
    date: "Wed, 14 May",
    slot: "Slot B · 13:00",
    status: "Confirmed",
  },
  {
    code: "MA-201",
    title: "Linear Algebra",
    date: "Fri, 16 May",
    slot: "Slot A · 09:00",
    status: "Pending",
  },
];

const statusStyles: Record<string, string> = {
  Confirmed: "bg-emerald-50 text-emerald-700",
  Pending: "bg-amber-50 text-amber-700",
};

export function DashboardPreview() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-xl shadow-indigo-600/10">
      <div className="flex items-center gap-2 px-3 py-2">
        <span className="h-3 w-3 rounded-full bg-red-400" />
        <span className="h-3 w-3 rounded-full bg-amber-400" />
        <span className="h-3 w-3 rounded-full bg-emerald-400" />
        <span className="ml-3 text-xs font-medium text-slate-400">
          examslot.app / my-date-sheet
        </span>
      </div>

      <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              My Date Sheet
            </p>
            <p className="mt-0.5 text-lg font-bold text-slate-900">Spring 2026</p>
          </div>
          <span className="rounded-full bg-indigo-600 px-3 py-1 text-xs font-semibold text-white">
            3 Courses
          </span>
        </div>

        <ul className="mt-4 flex flex-col gap-2.5">
          {rows.map((row) => (
            <li
              key={row.code}
              className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-3"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  <span className="text-indigo-600">{row.code}</span> · {row.title}
                </p>
                <p className="mt-0.5 text-xs text-slate-500">
                  {row.date} · {row.slot}
                </p>
              </div>
              <span
                className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusStyles[row.status]}`}
              >
                {row.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
