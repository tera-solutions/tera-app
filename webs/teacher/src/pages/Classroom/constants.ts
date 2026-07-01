import type { ClassroomStatus } from "./_interface";

export const STATUS_LABEL: Record<ClassroomStatus, string> = {
  draft: "Nháp",
  upcoming: "Sắp khai giảng",
  active: "Đang hoạt động",
  suspended: "Tạm ngưng",
  completed: "Đã kết thúc",
};

export const STATUS_OPTIONS: { value: ClassroomStatus; label: string }[] = (
  Object.entries(STATUS_LABEL) as [ClassroomStatus, string][]
).map(([value, label]) => ({ value, label }));

export const PER_PAGE = 20;

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
