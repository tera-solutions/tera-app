import type { MaterialType } from "./_interface";

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

export const MATERIAL_STAT_SEGMENTS: {
  key: string;
  label: string;
  types: MaterialType[] | null;
  iconClassName: string;
}[] = [
  { key: "all", label: "Tất cả tài liệu", types: null, iconClassName: "bg-sky-50 text-brand" },
  { key: "document", label: "Giáo án", types: ["document"], iconClassName: "bg-emerald-50 text-emerald-500" },
  { key: "presentation", label: "Bài giảng", types: ["presentation"], iconClassName: "bg-orange-50 text-orange-500" },
  { key: "exam", label: "Đề kiểm tra", types: ["exam"], iconClassName: "bg-violet-50 text-violet-500" },
  { key: "worksheet", label: "Phiếu bài tập", types: ["worksheet"], iconClassName: "bg-rose-50 text-rose-500" },
  { key: "other", label: "Tài liệu khác", types: ["pdf", "image", "video", "audio", "homework", "other"], iconClassName: "bg-slate-100 text-slate-500" },
];
