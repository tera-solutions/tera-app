import type { TeacherSortBy } from "./_interface";

/** Kept in sync with the `teacher_status` metadata list (see TeacherStatus enum). */
export const TEACHER_STATUS_META = "teacher_status";

/** Kept in sync with the `teacher_type` metadata list (see TeacherType enum). */
export const TEACHER_TYPE_META = "teacher_type";

export const EMPLOYMENT_TYPES = [
  { value: "contract", label: "Hợp đồng" },
  { value: "collaborator", label: "Cộng tác viên" },
  { value: "probation", label: "Thử việc" },
];

export const SORT_OPTIONS: { value: TeacherSortBy; label: string }[] = [
  { value: "full_name", label: "Tên" },
  { value: "code", label: "Mã giáo viên" },
  { value: "joined_at", label: "Ngày vào làm" },
];
