import type { ScheduleStatus } from "./_interface";

export const WEEKDAY_LABELS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

export const WEEKDAY_FULL = [
  "Thứ 2",
  "Thứ 3",
  "Thứ 4",
  "Thứ 5",
  "Thứ 6",
  "Thứ 7",
  "Chủ nhật",
];

/** Statuses offered in the filter panel, in display order. */
export const STATUS_FILTER_OPTIONS: ScheduleStatus[] = [
  "upcoming",
  "ongoing",
  "done",
  "cancelled",
];

/** Statuses checked by default (everything except cancelled). */
export const DEFAULT_STATUSES: ScheduleStatus[] = ["upcoming", "ongoing", "done"];

/** Deterministic colour per class so the same class keeps its colour. */
const CLASS_PALETTE = [
  { block: "bg-sky-50 border-sky-200", accent: "bg-sky-400", text: "text-sky-700" },
  {
    block: "bg-emerald-50 border-emerald-200",
    accent: "bg-emerald-400",
    text: "text-emerald-700",
  },
  {
    block: "bg-violet-50 border-violet-200",
    accent: "bg-violet-400",
    text: "text-violet-700",
  },
  {
    block: "bg-amber-50 border-amber-200",
    accent: "bg-amber-400",
    text: "text-amber-700",
  },
  {
    block: "bg-rose-50 border-rose-200",
    accent: "bg-rose-400",
    text: "text-rose-700",
  },
  {
    block: "bg-cyan-50 border-cyan-200",
    accent: "bg-cyan-400",
    text: "text-cyan-700",
  },
];

export const getClassColor = (classId: number) =>
  CLASS_PALETTE[Math.abs(classId) % CLASS_PALETTE.length];

/** Minutes from midnight for a "HH:mm" string (used to order slots). */
export const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};
