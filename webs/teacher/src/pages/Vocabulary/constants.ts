import type { AiJobStatus } from "@tera/api";

import type { VocabularyStatusGroup } from "./_interface";

/** `AiJobStatus` is a generation-pipeline state machine, not a publish flag — bucket the
 * intermediate steps (resize/thumbnail/webp/...) into one "processing" state for the UI. */
export const STATUS_GROUP_BY_JOB_STATUS: Record<AiJobStatus, VocabularyStatusGroup> = {
  SUCCESS: "success",
  FAILED: "failed",
  RETRY: "failed",
  WAITING: "processing",
  GENERATING: "processing",
  DOWNLOADING: "processing",
  REMOVE_BG: "processing",
  RESIZE: "processing",
  THUMBNAIL: "processing",
  WEBP: "processing",
  METADATA: "processing",
  UPLOAD: "processing",
};

export const STATUS_GROUP_META: Record<
  VocabularyStatusGroup,
  { label: string; dotClassName: string; textClassName: string }
> = {
  success: { label: "Đã tạo xong", dotClassName: "bg-emerald-500", textClassName: "text-emerald-600" },
  processing: { label: "Đang xử lý", dotClassName: "bg-amber-400", textClassName: "text-amber-600" },
  failed: { label: "Lỗi", dotClassName: "bg-rose-500", textClassName: "text-rose-600" },
};

export const TOPIC_BADGE_CLASSNAMES: Record<string, string> = {
  animal: "bg-violet-50 text-violet-600",
  fruit: "bg-orange-50 text-orange-600",
  food: "bg-teal-50 text-teal-600",
  family: "bg-pink-50 text-pink-600",
  color: "bg-sky-50 text-brand",
};

export const DEFAULT_TOPIC_BADGE_CLASSNAME = "bg-slate-100 text-slate-600";

export const STATUS_FILTER_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "success", label: "Đã tạo xong" },
  { value: "processing", label: "Đang xử lý" },
  { value: "failed", label: "Lỗi" },
];
