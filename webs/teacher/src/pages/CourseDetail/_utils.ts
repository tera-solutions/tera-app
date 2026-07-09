import type { CourseDetail, CourseStats, CurriculumItem } from "./_interface";

/** Objective is stored as a single ";"-joined string; count the non-empty entries. */
const countObjectives = (value: unknown): number =>
  typeof value === "string"
    ? value.split(";").map((v) => v.trim()).filter(Boolean).length
    : 0;

/** Maps a lesson plan's `lessons` (edu_lesson_plan_lessons) — the course's reusable curriculum, independent of any specific class's schedule. */
export const toCurriculumItems = (raw: any[] | null | undefined): CurriculumItem[] =>
  (raw ?? [])
    .map((item) => ({
      id: item.id ?? 0,
      order: item.lesson_no ?? 0,
      title: item.lesson_title ?? "",
      duration: item.duration ?? 0,
      objective_count: countObjectives(item.objective),
      activities_count: Array.isArray(item.activities) ? item.activities.length : 0,
      materials_count: Array.isArray(item.materials) ? item.materials.length : 0,
    }))
    .sort((a, b) => a.order - b.order);

export const toCourseDetail = (raw: any): CourseDetail | null => {
  if (!raw) return null;
  return {
    id: raw.id ?? 0,
    name: raw.name ?? "",
    code: raw.code ?? "",
    thumbnail: raw.thumbnail ?? "",
    description: raw.description ?? "",
    duration_minutes: raw.duration_minutes ?? 0,
  };
};

/**
 * `financial`/`rating` blocks are backend placeholders (hardcoded 0 — no
 * finance/review tables linked to courses yet), so only `operational` is
 * used. `completion_rate` isn't a real field either — it's derived here
 * from two real counts (`completed_students`/`total_students`).
 */
export const toCourseStats = (raw: any): CourseStats => {
  const operational = raw?.operational ?? {};
  const totalStudents = operational.total_students ?? 0;
  const completedStudents = operational.completed_students ?? 0;

  return {
    total_classes: operational.total_classes ?? 0,
    active_classes: operational.active_classes ?? 0,
    total_students: totalStudents,
    completed_students: completedStudents,
    completion_rate: totalStudents ? Math.round((completedStudents / totalStudents) * 100) : 0,
  };
};
