import type { CourseDetail, CourseStats, CurriculumItem } from "./_interface";

/** Maps a course's `curriculums` (edu_course_curriculums) — its syllabus outline, independent of any lesson plan or class. */
export const toCurriculumItems = (raw: any[] | null | undefined): CurriculumItem[] =>
  (raw ?? [])
    .map((item) => ({
      id: item.id ?? 0,
      order: item.order ?? 0,
      title: item.title ?? "",
      content: item.content ?? "",
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
    price_per_lesson: Number(raw.price_per_lesson ?? 0),
    tuition_type: raw.tuition_type ?? "per_lesson",
    is_active: !!raw.is_active,
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
