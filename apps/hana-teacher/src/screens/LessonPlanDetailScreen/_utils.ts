import {
  ClassroomOption,
  LessonPlanDetailInfo,
  LessonRow,
  LessonTemplateSummary,
} from './types';

export function formatDate(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const durationMinutes = (start: string, end: string): number => {
  if (!start || !end) return 0;
  return Math.max(0, toMinutes(end) - toMinutes(start));
};

export function toLessonPlanDetailInfo(raw: any): LessonPlanDetailInfo | undefined {
  if (!raw?.id) return undefined;
  return {
    id: raw.id,
    planCode: raw.plan_code ?? '',
    planName: raw.plan_name ?? '',
    courseName: raw.course?.name ?? raw.course_name ?? '',
    levelName: raw.level?.level_name ?? raw.level?.name ?? raw.level_name ?? '',
    version: raw.version ?? 1,
    description: raw.description ?? '',
    status: (raw.status ?? 'draft') as LessonPlanDetailInfo['status'],
  };
}

const countObjectives = (value: unknown): number =>
  typeof value === 'string' ? value.split(';').map((v) => v.trim()).filter(Boolean).length : 0;

export function toLessonTemplateSummaries(raw: any[] | null | undefined): LessonTemplateSummary[] {
  return (raw ?? [])
    .map((item) => ({
      id: item.id ?? 0,
      lessonNo: item.lesson_no ?? 0,
      lessonTitle: item.lesson_title ?? '',
      duration: item.duration ?? 0,
      objectiveCount: countObjectives(item.objective),
      activitiesCount: Array.isArray(item.activities) ? item.activities.length : 0,
      materialsCount: Array.isArray(item.materials) ? item.materials.length : 0,
    }))
    .sort((a, b) => a.lessonNo - b.lessonNo);
}

export function toClassrooms(raw: any[] | null | undefined): ClassroomOption[] {
  return (raw ?? []).map((item) => ({
    id: item.id,
    name: item.name ?? '',
    coverImage: item.cover_image ?? null,
  }));
}

export function toLessonRows(raw: any[] | null | undefined): LessonRow[] {
  return (raw ?? []).map((item) => {
    const start = (item.start_time ?? '').slice(0, 5);
    const end = (item.end_time ?? '').slice(0, 5);
    return {
      id: item.id,
      lessonNo: item.lesson_no ?? 0,
      lessonTitle: item.lesson_title ?? '',
      date: formatDate(item.lesson_date),
      duration: item.duration ?? durationMinutes(start, end),
      status: (item.status ?? 'upcoming') as LessonRow['status'],
      isLocked: !!item.is_locked,
    };
  });
}
