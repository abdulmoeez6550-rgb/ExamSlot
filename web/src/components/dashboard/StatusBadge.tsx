import type { ExamStatus, RequestStatus, SlotStatus } from "./demo-data";

const tones: Record<string, string> = {
  ok: "text-ok",
  warn: "text-warn",
  danger: "text-danger",
  accent: "text-accent",
  muted: "text-muted",
};

const examConfig: Record<ExamStatus, { label: string; tone: keyof typeof tones }> = {
  confirmed: { label: "Confirmed", tone: "ok" },
  pending: { label: "Pending", tone: "warn" },
  "action-required": { label: "Action required", tone: "danger" },
};

const requestConfig: Record<RequestStatus, { label: string; tone: keyof typeof tones }> = {
  pending: { label: "Pending", tone: "warn" },
  approved: { label: "Approved", tone: "ok" },
  rejected: { label: "Rejected", tone: "danger" },
};

const slotConfig: Record<SlotStatus, { label: string; tone: keyof typeof tones }> = {
  confirmed: { label: "Confirmed", tone: "ok" },
  "awaiting-approval": { label: "Awaiting approval", tone: "warn" },
  "needs-selection": { label: "Needs selection", tone: "danger" },
};

export function ExamStatusBadge({ status }: { status: ExamStatus }) {
  const { label, tone } = examConfig[status];
  return <span className={`es-badge ${tones[tone]}`}>{label}</span>;
}

export function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const { label, tone } = requestConfig[status];
  return <span className={`es-badge ${tones[tone]}`}>{label}</span>;
}

export function SlotStatusBadge({ status }: { status: SlotStatus }) {
  const { label, tone } = slotConfig[status];
  return <span className={`es-badge ${tones[tone]}`}>{label}</span>;
}
