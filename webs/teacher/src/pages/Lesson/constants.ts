import type { LessonDetailTab } from "./_interface";

/** Shared enum metadata list name (see `/auth/metadata`). */
export const LESSON_STATUS_META = "lesson_status";

/** Shared enum metadata list name for activity status (see `/auth/metadata`). */
export const LESSON_ACTIVITY_STATUS_META = "lesson_activity_status";

export const DETAIL_TABS: { key: LessonDetailTab; label: string }[] = [
  { key: "overview", label: "Tổng quan" },
  { key: "content", label: "Nội dung" },
  { key: "activities", label: "Hoạt động" },
  { key: "materials", label: "Tài liệu" },
  { key: "notes", label: "Ghi chú" },
];

/** Tailwind background/text tokens per material extension group. */
export const MATERIAL_STYLE: Record<string, { badge: string; label: string }> = {
  pdf: { badge: "bg-red-50 text-red-500", label: "PDF" },
  doc: { badge: "bg-sky-50 text-brand", label: "DOC" },
  docx: { badge: "bg-sky-50 text-brand", label: "DOC" },
  ppt: { badge: "bg-orange-50 text-orange-500", label: "PPT" },
  pptx: { badge: "bg-orange-50 text-orange-500", label: "PPT" },
  mp3: { badge: "bg-violet-50 text-violet-500", label: "MP3" },
  mp4: { badge: "bg-violet-50 text-violet-500", label: "MP4" },
  jpg: { badge: "bg-emerald-50 text-emerald-500", label: "IMG" },
  jpeg: { badge: "bg-emerald-50 text-emerald-500", label: "IMG" },
  png: { badge: "bg-emerald-50 text-emerald-500", label: "IMG" },
};

export const DEFAULT_MATERIAL_STYLE = {
  badge: "bg-slate-100 text-slate-500",
  label: "FILE",
};

/** Debounce window before the personal note auto-saves (ms). */
export const NOTE_AUTOSAVE_DELAY = 2000;
export const NOTE_MAX_LENGTH = 2000;

export const MATERIAL_ACCEPT = ".pdf,.doc,.docx,.ppt,.pptx,.jpg,.jpeg,.png";
export const MATERIAL_MAX_SIZE = 10 * 1024 * 1024; // 10MB
