import type { ClassroomSortBy } from "./_interface";

export const SORT_BY_OPTIONS: { value: ClassroomSortBy; label: string }[] = [
  { value: "created_at", label: "Mới tạo" },
  { value: "name", label: "Tên lớp" },
  { value: "start_date", label: "Ngày khai giảng" },
  { value: "status", label: "Trạng thái" },
];

/** Kept in sync with ClassService::baseQuery's `shift` time ranges. */
export const SHIFT_OPTIONS: { value: string; label: string }[] = [
  { value: "morning", label: "Buổi sáng" },
  { value: "afternoon", label: "Buổi chiều" },
  { value: "evening", label: "Buổi tối" },
];

/** Deterministic gradient per class so each card keeps a stable cover colour. */
const COVER_PALETTE = [
  "from-sky-400 to-blue-500",
  "from-emerald-400 to-teal-500",
  "from-violet-400 to-purple-500",
  "from-amber-400 to-orange-500",
  "from-rose-400 to-pink-500",
  "from-cyan-400 to-sky-500",
];

export const getCoverGradient = (id: number) =>
  COVER_PALETTE[Math.abs(id) % COVER_PALETTE.length];

/** Donut colour ramps by completion level. */
export const getDonutColor = (rate: number): string => {
  if (rate >= 90) return "#22c55e";
  if (rate >= 75) return "#0ea5e9";
  if (rate >= 50) return "#f59e0b";
  return "#ef4444";
};
