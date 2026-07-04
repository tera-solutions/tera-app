export const LEVEL_OPTIONS = [
  { value: "starters", label: "Starters" },
  { value: "movers", label: "Movers" },
  { value: "flyers", label: "Flyers" },
];

export const STATUS_OPTIONS = [
  { value: "active", label: "Đang học" },
  { value: "dropped", label: "Đã nghỉ" },
  { value: "completed", label: "Hoàn thành" },
];

export const RANK_OPTIONS = [
  { value: "excellent", label: "Giỏi" },
  { value: "good", label: "Khá" },
  { value: "average", label: "Trung bình" },
];

export const SORT_OPTIONS: { value: string; label: string }[] = [
  { value: "name", label: "Tên" },
  { value: "enrollment_date", label: "Ngày nhập học" },
  { value: "avg_score", label: "Điểm TB" },
];

const STUDENT_STATUS_STYLE: Record<string, { label: string; badge: string }> = {
  active: { label: "Đang học", badge: "bg-emerald-50 text-emerald-600" },
  studying: { label: "Đang học", badge: "bg-emerald-50 text-emerald-600" },
  dropped: { label: "Đã nghỉ", badge: "bg-red-50 text-red-500" },
  inactive: { label: "Đã nghỉ", badge: "bg-red-50 text-red-500" },
  completed: { label: "Hoàn thành", badge: "bg-sky-50 text-brand" },
};

export const getStudentStatusStyle = (status: string) =>
  STUDENT_STATUS_STYLE[status?.toLowerCase()] ?? {
    label: status || "—",
    badge: "bg-slate-100 text-slate-500",
  };

/** Score-derived classification — no dedicated backend field is confirmed to exist. */
export const getRank = (avgScore: number | null): { label: string; badge: string } => {
  if (avgScore == null) return { label: "—", badge: "bg-slate-100 text-slate-500" };
  if (avgScore >= 8) return { label: "Giỏi", badge: "bg-emerald-50 text-emerald-600" };
  if (avgScore >= 6.5) return { label: "Khá", badge: "bg-amber-50 text-amber-600" };
  return { label: "Trung bình", badge: "bg-slate-100 text-slate-500" };
};
