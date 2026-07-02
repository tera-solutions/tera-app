import { toDate, toTime } from "_common/utils/schedule";

import type { Lesson, LessonPlan, PlanStats } from "./_interface";

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
  return (h || 0) * 60 + (m || 0);
};

const durationMinutes = (start: string, end: string): number => {
  if (!start || !end) return 0;
  return Math.max(0, toMinutes(end) - toMinutes(start));
};

export const toLesson = (raw: any): Lesson => {
  const start = toTime(raw.start_time);
  const end = toTime(raw.end_time);
  return {
    id: raw.id ?? 0,
    class_room_id: raw.class_room_id ?? raw.class?.id ?? 0,
    lesson_plan_id: raw.lesson_plan_id ?? null,
    lesson_no: raw.lesson_no ?? 0,
    lesson_title: raw.lesson_title ?? "",
    date: toDate(raw.lesson_date),
    start_time: start,
    end_time: end,
    duration: raw.duration ?? durationMinutes(start, end),
    status: raw.status ?? "",
    is_locked: !!raw.is_locked,
    objective: raw.objective ?? "",
    activities: raw.activities ?? "",
    lesson_note: raw.lesson_note ?? "",
  };
};

export const toLessons = (raw: any[] | null | undefined): Lesson[] =>
  (raw ?? []).map(toLesson);

/** Predicate for the active status tab (raw status value or "all"). */
export const matchesTab = (lesson: Lesson, tab: string): boolean =>
  tab === "all" || lesson.status === tab;

export const toLessonPlan = (raw: any): LessonPlan => ({
  id: raw.id ?? 0,
  plan_code: raw.plan_code ?? "",
  plan_name: raw.plan_name ?? "",
  avatar: raw.avatar ?? "",
  course_id: raw.course_id ?? raw.course?.id ?? null,
  course_name: raw.course?.name ?? raw.course_name ?? "",
  level_id: raw.level_id ?? raw.level?.id ?? null,
  level_name: raw.level?.level_name ?? raw.level?.name ?? raw.level_name ?? "",
  version: raw.version ?? 1,
  total_lessons: raw.total_lessons ?? 0,
  description: raw.description ?? "",
  status: raw.status ?? "",
  updated_at: toDate(raw.updated_at),
});

export const toLessonPlans = (raw: any[] | null | undefined): LessonPlan[] =>
  (raw ?? []).map(toLessonPlan);

export const summarizePlans = (
  plans: LessonPlan[],
  total: number,
): PlanStats => ({
  total: total || plans.length,
  published: plans.filter((p) => p.status === "published").length,
  in_review: plans.filter(
    (p) => p.status === "draft" || p.status === "reviewing",
  ).length,
  archived: plans.filter((p) => p.status === "archived").length,
});

/** Predicate for the active plan status tab (raw status value or "all"). */
export const matchesPlanTab = (plan: LessonPlan, tab: string): boolean =>
  tab === "all" || plan.status === tab;
