import type { TransferEnrollmentRow } from "./_interface";

export const toTransferRow = (raw: any): TransferEnrollmentRow => ({
  enrollment_id: raw.id ?? 0,
  student_id: raw.student_id ?? raw.student?.id ?? 0,
  student_name: raw.student?.name ?? "",
  student_code: raw.student?.code ?? "",
  avatar: raw.student?.avatar ?? "",
  class_id: raw.class_id ?? raw.class?.id ?? 0,
  class_name: raw.class?.name ?? "",
  course_id: raw.course_id ?? raw.course?.id ?? 0,
  enrolled_at: raw.enrolled_at ?? "",
  completed_lessons: raw.completed_lessons ?? 0,
});

export const toTransferRows = (raw: any[] | null | undefined): TransferEnrollmentRow[] =>
  (raw ?? []).map(toTransferRow);
