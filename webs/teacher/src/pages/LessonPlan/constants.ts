import type { LessonPlanSortBy } from "./_interface";

/** Shared enum metadata list names (see `/auth/metadata`). */
export const LESSON_STATUS_META = "lesson_status";
export const LESSON_PLAN_STATUS_META = "lesson_plan_status";

export const SORT_BY_OPTIONS: { value: LessonPlanSortBy; label: string }[] = [
  { value: "created_at", label: "Mới tạo" },
  { value: "plan_name", label: "Tên giáo án" },
  { value: "plan_code", label: "Mã giáo án" },
  { value: "total_lessons", label: "Số bài học" },
];
