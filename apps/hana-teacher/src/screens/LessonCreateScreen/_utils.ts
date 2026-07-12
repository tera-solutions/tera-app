import { formatDate } from '@screens/LessonPlanDetailScreen/_utils';

import { ClassroomOption, PlanSummary } from './types';

export function toPlanSummary(raw: any): PlanSummary | null {
  if (!raw?.id) return null;
  return {
    id: raw.id,
    planName: raw.plan_name ?? '',
    planCode: raw.plan_code ?? '',
    courseName: raw.course?.name ?? raw.course_name ?? '',
    levelName: raw.level?.level_name ?? raw.level?.name ?? raw.level_name ?? '',
  };
}

export function toClassroomOptions(raw: any[] | null | undefined): ClassroomOption[] {
  return (raw ?? []).map((item) => ({
    id: item.id,
    name: item.name ?? '',
    courseName: item.course?.name ?? '',
    startDate: formatDate(item.start_date),
    endDate: formatDate(item.end_date),
  }));
}
