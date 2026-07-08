import type { Homework, HomeworkSummary } from "./_interface";

export const toHomework = (raw: any): Homework => ({
  id: raw.id ?? 0,
  code: raw.assignment_code ?? "",
  name: raw.assignment_name ?? "",
  type: raw.assignment_type ?? "",
  class_id: raw.class_room_id ?? raw.class?.id ?? null,
  class_name: raw.class?.name ?? "",
  course_id: raw.course_id ?? raw.course?.id ?? null,
  level_id: raw.level_id ?? null,
  due_date: raw.due_date ?? "",
  max_score: raw.max_score ?? 0,
  status: (raw.status ?? "draft") as Homework["status"],
  student_count: raw.submissions_count ?? 0,
  avatar_url: raw.avatar_url ?? "",
});

export const toHomeworks = (raw: any[] | null | undefined): Homework[] =>
  (raw ?? []).map(toHomework);

export const toHomeworkSummary = (raw: any): HomeworkSummary => ({
  total: raw?.total ?? 0,
  assigned: raw?.by_status?.published ?? 0,
  draft: raw?.by_status?.draft ?? 0,
  pending_grading: raw?.pending_grading ?? 0,
  due_this_week: raw?.due_this_week ?? 0,
});

export const isOverdue = (dueDate: string): boolean =>
  !!dueDate && new Date(dueDate).getTime() < Date.now();
