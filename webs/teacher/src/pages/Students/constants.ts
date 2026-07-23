import type { StudentSortBy, StudentSummary } from "./_interface";

/** Kept in sync with the `student_status` metadata list (see StudentStatus enum). */
export const STUDENT_STATUS_META = "student_status";

/**
 * The curated subset of `student_status` shown on the summary donut, mapped to
 * their `StudentSummary` field. `metaValue` is the real backend enum value used
 * to look up label/color — `summary.completed` counts the "graduated" status,
 * so the two intentionally differ.
 */
export const STUDENT_SUMMARY_SEGMENTS: {
  key: string;
  metaValue: string;
  fallbackLabel: string;
  fallbackColor: string;
  value: (summary: StudentSummary) => number;
}[] = [
  { key: "active", metaValue: "active", fallbackLabel: "Đang học", fallbackColor: "#10b981", value: (s) => s.active },
  { key: "debt", metaValue: "debt", fallbackLabel: "Nợ học phí", fallbackColor: "#dc2626", value: (s) => s.debt },
  { key: "dropped", metaValue: "dropped", fallbackLabel: "Đã nghỉ", fallbackColor: "#ef4444", value: (s) => s.dropped },
  { key: "completed", metaValue: "graduated", fallbackLabel: "Hoàn thành", fallbackColor: "#8b5cf6", value: (s) => s.completed },
];

export const SORT_OPTIONS: { value: StudentSortBy; label: string }[] = [
  { value: "name", label: "Tên" },
  { value: "enrollment_date", label: "Ngày nhập học" },
  { value: "avg_score", label: "Điểm TB" },
];

/** Score-derived classification — no dedicated backend field is confirmed to exist. */
export const getRank = (avgScore: number | null): { label: string; badge: string } => {
  if (avgScore == null) return { label: "—", badge: "bg-slate-100 text-slate-500" };
  if (avgScore >= 8) return { label: "Giỏi", badge: "bg-emerald-50 text-emerald-600" };
  if (avgScore >= 6.5) return { label: "Khá", badge: "bg-amber-50 text-amber-600" };
  return { label: "Trung bình", badge: "bg-slate-100 text-slate-500" };
};
