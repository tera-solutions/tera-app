import type { Assignment, AssignmentSummary } from "./_interface";

export const toAssignment = (raw: any): Assignment => ({
  id: raw.id ?? 0,
  code: raw.assignment_code ?? "",
  name: raw.assignment_name ?? "",
  type: raw.assignment_type ?? "",
  class_id: raw.class_room_id ?? raw.class?.id ?? null,
  class_name: raw.class?.name ?? "",
  course_id: raw.course_id ?? raw.course?.id ?? null,
  level_id: raw.level_id ?? null,
  lesson_id: raw.lesson_id ?? raw.lesson?.id ?? null,
  description: raw.description ?? "",
  instruction: raw.instruction ?? "",
  due_date: raw.due_date ?? "",
  max_score: raw.max_score ?? 0,
  status: (raw.status ?? "draft") as Assignment["status"],
  student_count: raw.submissions_count ?? 0,
  avatar_url: raw.avatar_url ?? "",
  allow_late_submission: raw.allow_late_submission ?? false,
  allow_multiple_submission: raw.allow_multiple_submission ?? false,
});

export const toAssignments = (raw: any[] | null | undefined): Assignment[] =>
  (raw ?? []).map(toAssignment);

export const toAssignmentSummary = (raw: any): AssignmentSummary => ({
  total: raw?.total ?? 0,
  assigned: raw?.by_status?.published ?? 0,
  draft: raw?.by_status?.draft ?? 0,
  pending_grading: raw?.pending_grading ?? 0,
  due_this_week: raw?.due_this_week ?? 0,
});

export const isOverdue = (dueDate: string): boolean =>
  !!dueDate && new Date(dueDate).getTime() < Date.now();
