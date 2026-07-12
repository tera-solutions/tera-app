import { CourseDetailInfo, CourseResponse, CourseStats, CourseStatsRaw, CurriculumItem, CurriculumRaw } from './types';

export function toCourseDetailInfo(course?: CourseResponse | null): CourseDetailInfo | null {
  if (!course) return null;

  return {
    id: course.id,
    name: course.name,
    code: course.code ?? '',
    thumbnail: course.thumbnail ?? '',
    description: course.description ?? '',
    durationMinutes: course.duration_minutes ?? 0,
    pricePerLesson: Number(course.price_per_lesson ?? 0),
    isActive: !!course.is_active,
  };
}

/**
 * `financial`/`rating` blocks are backend placeholders (not real yet), so
 * only `operational` is used — mirrors webs/teacher/CourseDetail/_utils.ts.
 */
export function toCourseStats(raw?: CourseStatsRaw | null): CourseStats {
  const operational = raw?.operational ?? {};
  const totalStudents = operational.total_students ?? 0;
  const completedStudents = operational.completed_students ?? 0;

  return {
    totalClasses: operational.total_classes ?? 0,
    activeClasses: operational.active_classes ?? 0,
    totalStudents,
    completedStudents,
    completionRate: totalStudents ? Math.round((completedStudents / totalStudents) * 100) : 0,
  };
}

export function toCurriculumItems(raw?: CurriculumRaw[] | null): CurriculumItem[] {
  return (raw ?? [])
    .map((item) => ({
      id: item.id ?? 0,
      order: item.order ?? 0,
      title: item.title ?? '',
      content: item.content ?? '',
    }))
    .sort((a, b) => a.order - b.order);
}
