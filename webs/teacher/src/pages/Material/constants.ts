import type { MaterialSummary, MaterialType } from "./_interface";

export const MATERIAL_TYPE_LABELS: Record<MaterialType, string> = {
  pdf: "PDF",
  document: "Tài liệu",
  image: "Hình ảnh",
  video: "Video",
  audio: "Audio",
  presentation: "Bài giảng",
  worksheet: "Phiếu bài tập",
  homework: "Bài tập",
  exam: "Đề kiểm tra",
  other: "Khác",
};

export const MATERIAL_TYPE_BADGE: Record<MaterialType, string> = {
  pdf: "bg-red-50 text-red-500",
  document: "bg-sky-50 text-brand",
  image: "bg-violet-50 text-violet-500",
  video: "bg-amber-50 text-amber-500",
  audio: "bg-amber-50 text-amber-500",
  presentation: "bg-orange-50 text-orange-500",
  worksheet: "bg-rose-50 text-rose-500",
  homework: "bg-emerald-50 text-emerald-500",
  exam: "bg-violet-50 text-violet-500",
  other: "bg-slate-100 text-slate-500",
};

export const MATERIAL_TYPE_OPTIONS = [
  { value: "", label: "Tất cả loại" },
  ...Object.entries(MATERIAL_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

export const ACCESS_TYPE_OPTIONS = [
  { value: "teacher", label: "Giáo viên" },
  { value: "student", label: "Học viên" },
  { value: "parent", label: "Phụ huynh" },
  { value: "internal", label: "Nội bộ" },
];

export const MATERIAL_SORT_OPTIONS = [
  { value: "created_at", label: "Cập nhật gần nhất" },
  { value: "material_name", label: "Tên tài liệu" },
  { value: "material_type", label: "Loại tài liệu" },
];

/**
 * Type-filter tabs (StatusTabs pattern). Each key maps 1:1 to a real
 * `material_type` value the API accepts — unlike the old grouped stat-card
 * buttons, there's no "Khác" bucket here that silently reset the filter.
 * The remaining raw types (pdf/image/video/audio/homework/other) stay
 * reachable via the exhaustive dropdown in MaterialFilterSidebar.
 */
export const MATERIAL_TYPE_TABS: { key: MaterialType | "all"; label: string }[] = [
  { key: "all", label: "Tất cả" },
  { key: "document", label: "Giáo án" },
  { key: "presentation", label: "Bài giảng" },
  { key: "exam", label: "Đề kiểm tra" },
  { key: "worksheet", label: "Phiếu bài tập" },
];

/** Curated breakdown shown on the stat cards + summary donut. */
export const MATERIAL_SUMMARY_SEGMENTS: {
  key: string;
  label: string;
  color: string;
  types: MaterialType[];
  value: (summary: MaterialSummary) => number;
}[] = [
  {
    key: "document",
    label: "Giáo án",
    color: "#10b981",
    types: ["document"],
    value: (s) => s.byType.document ?? 0,
  },
  {
    key: "presentation",
    label: "Bài giảng",
    color: "#f97316",
    types: ["presentation"],
    value: (s) => s.byType.presentation ?? 0,
  },
  {
    key: "exam",
    label: "Đề kiểm tra",
    color: "#8b5cf6",
    types: ["exam"],
    value: (s) => s.byType.exam ?? 0,
  },
  {
    key: "worksheet",
    label: "Phiếu bài tập",
    color: "#f43f5e",
    types: ["worksheet"],
    value: (s) => s.byType.worksheet ?? 0,
  },
  {
    key: "other",
    label: "Khác",
    color: "#94a3b8",
    types: ["pdf", "image", "video", "audio", "homework", "other"],
    value: (s) =>
      ["pdf", "image", "video", "audio", "homework", "other"].reduce(
        (sum, type) => sum + (s.byType[type] ?? 0),
        0,
      ),
  },
];
