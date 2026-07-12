import moment from 'moment';

import type { LessonActivity, LessonActivityStatus, LessonDetail, LessonMaterialItem } from './types';

const toDate = (value?: string | null): string => (value ? moment(value).format('DD/MM/YYYY') : '');
const toTime = (value?: string | null): string => (value ? String(value).slice(0, 5) : '');

const toMinutes = (time: string): number => {
  const [h, m] = time.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
};

const durationMinutes = (start: string, end: string): number => {
  if (!start || !end) return 0;
  return Math.max(0, toMinutes(end) - toMinutes(start));
};

/** Split a free-text block into trimmed, non-empty lines, stripping bullet chars. */
const toLines = (value: unknown): string[] => {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }
  if (typeof value !== 'string') return [];
  return value
    .split(/;|\r?\n/)
    .map((line) => line.replace(/^[\s•\-*]+/, '').trim())
    .filter(Boolean);
};

/** Pull "45 phút", "45 min", or a bare number out of a text fragment. */
const parseDuration = (value: unknown): number => {
  if (typeof value === 'number') return Math.max(0, Math.round(value));
  const match = String(value ?? '').match(/(\d+)/);
  return match ? Number(match[1]) : 0;
};

const ACTIVITY_STATUSES: LessonActivityStatus[] = ['pending', 'in_progress', 'completed'];

const toActivityStatus = (value: unknown): LessonActivityStatus =>
  ACTIVITY_STATUSES.includes(value as LessonActivityStatus) ? (value as LessonActivityStatus) : 'pending';

const parseActivity = (raw: any, index: number): LessonActivity => {
  if (raw && typeof raw === 'object') {
    return {
      id: raw.id ?? index,
      name: String(raw.name ?? raw.title ?? '').trim(),
      duration: parseDuration(raw.duration ?? raw.minutes),
      description: String(raw.description ?? raw.content ?? '').trim(),
      avatar: String(raw.avatar_url ?? raw.avatar ?? '').trim(),
      status: toActivityStatus(raw.status),
    };
  }

  const line = String(raw ?? '').trim();
  const [head, ...rest] = line.split(':');
  const description = rest.join(':').trim();

  const durationMatch = head.match(/\(([^)]*\d+[^)]*)\)/);
  const duration = durationMatch ? parseDuration(durationMatch[1]) : 0;
  const name = head.replace(/\([^)]*\)/, '').trim();

  return { id: index, name: name || line, duration, description, avatar: '', status: 'pending' };
};

const toActivities = (raw: unknown): LessonActivity[] => {
  if (Array.isArray(raw)) return raw.map(parseActivity).filter((a) => a.name);
  return toLines(raw)
    .map((line, index) => parseActivity(line, index))
    .filter((a) => a.name);
};

const humanSize = (value: unknown): string => {
  if (typeof value === 'string') return value.trim();
  if (typeof value !== 'number' || value <= 0) return '';
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = value;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) {
    size /= 1024;
    unit += 1;
  }
  return `${Math.round(size * 10) / 10} ${units[unit]}`;
};

const extOf = (name: string, url: string): string => {
  const source = /\.[a-z0-9]+$/i.test(name) ? name : url;
  const match = source.match(/\.([a-z0-9]+)(?:\?|#|$)/i);
  return match ? match[1].toLowerCase() : '';
};

const toMaterial = (raw: any, index: number): LessonMaterialItem => {
  const name = String(raw?.name ?? raw?.file_name ?? raw?.title ?? '').trim();
  const url = String(raw?.url ?? raw?.link ?? raw?.file_url ?? raw?.path ?? '');
  return {
    id: raw?.id ?? index,
    file_id: raw?.file_id ?? raw?.file?.id ?? raw?.id ?? index,
    name: name || `Tài liệu ${index + 1}`,
    url,
    size: humanSize(raw?.size ?? raw?.file_size),
    ext: extOf(name, url),
  };
};

const toMaterials = (raw: unknown): LessonMaterialItem[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(toMaterial);
};

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === 'string' && value.trim()) return value.trim();
  }
  return '';
};

const firstNumber = (...values: unknown[]): number => {
  for (const value of values) {
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
  }
  return 0;
};

export const toLessonDetail = (raw: any): LessonDetail | null => {
  if (!raw?.id) return null;

  const start = toTime(raw.start_time);
  const end = toTime(raw.end_time);
  const classRoom = raw.class_room ?? raw.class ?? {};
  const course = classRoom.course ?? raw.course ?? {};

  const unitLabel = firstString(raw.unit, raw.unit_name, raw.lesson_no ? `Buổi ${raw.lesson_no}` : '');

  return {
    id: raw.id ?? 0,
    class_room_id: raw.class_room_id ?? classRoom.id ?? 0,
    lesson_plan_id: raw.lesson_plan_id ?? null,
    avatar: firstString(raw.avatar, raw.lesson_plan?.avatar, classRoom.avatar),
    lesson_no: raw.lesson_no ?? 0,
    lesson_title: firstString(raw.lesson_title, raw.title, raw.name),
    unit: unitLabel,
    class_name: firstString(raw.class_name, classRoom.name),
    course_name: firstString(raw.course_name, course.name),
    level: firstString(raw.level, course.level, classRoom.level),
    audience: firstString(raw.audience, raw.target, course.target),
    room: firstString(raw.room, classRoom.room?.name, raw.room_name),
    status: (raw.status as LessonDetail['status']) ?? 'upcoming',
    date: toDate(raw.lesson_date ?? raw.date),
    start_time: start,
    end_time: end,
    duration: firstNumber(raw.duration) || durationMinutes(start, end),
    is_locked: !!raw.is_locked,
    objectives: toLines(raw.objectives ?? raw.objective),
    activities: toActivities(raw.activities),
    materials: toMaterials(raw.materials ?? raw.documents ?? raw.attachments),
    lesson_note: firstString(raw.lesson_note, raw.personal_note, raw.note),
    completion_rate: Math.round(firstNumber(raw.completion_rate, raw.stats?.completion_rate)),
    created_at: raw.created_at ? moment(raw.created_at).format('DD/MM/YYYY') : '',
    updated_at: raw.updated_at ? moment(raw.updated_at).format('DD/MM/YYYY') : '',
    updated_by: firstString(raw.updated_by?.full_name, raw.updated_by),
  };
};
