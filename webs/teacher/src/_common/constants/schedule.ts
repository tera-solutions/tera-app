import type { ScheduleStatus } from "_common/types/schedule";

/**
 * Label + colour metadata for a class-session status, shared by the Schedule
 * and Dashboard pages. `badge` styles the status pill; `bar` the accent bar.
 */
export const SCHEDULE_STATUS: Record<
  ScheduleStatus,
  { label: string; badge: string; bar: string }
> = {
  upcoming: {
    label: "Sắp diễn ra",
    badge: "bg-sky-50 text-sky-600",
    bar: "bg-brand",
  },
  ongoing: {
    label: "Đã diễn ra",
    badge: "bg-emerald-50 text-emerald-600",
    bar: "bg-emerald-400",
  },
  done: {
    label: "Đã kết thúc",
    badge: "bg-orange-50 text-orange-600",
    bar: "bg-orange-400",
  },
  cancelled: {
    label: "Đã hủy",
    badge: "bg-slate-100 text-slate-500",
    bar: "bg-slate-200",
  },
};
