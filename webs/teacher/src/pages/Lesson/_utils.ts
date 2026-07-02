import { toDate, toTime } from "_common/utils/schedule";

import type {
  LessonActivity,
  LessonDetail,
  LessonMaterial,
} from "./_interface";

const toMinutes = (time: string): number => {
  const [h, m] = time.split(":").map(Number);
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
  if (typeof value !== "string") return [];
  return value
    .split(/\r?\n/)
    .map((line) => line.replace(/^[\s•\-*]+/, "").trim())
    .filter(Boolean);
};

/** Pull "45 phút", "45 min", or a bare number out of a text fragment. */
const parseDuration = (value: unknown): number => {
  if (typeof value === "number") return Math.max(0, Math.round(value));
  const match = String(value ?? "").match(/(\d+)/);
  return match ? Number(match[1]) : 0;
};

/**
 * The lesson entity stores activities as free text (one per line). Parse the
 * common "Name (10 phút): description" shape, degrading gracefully when a line
 * only carries a name.
 */
const parseActivity = (raw: any): LessonActivity => {
  if (raw && typeof raw === "object") {
    return {
      name: String(raw.name ?? raw.title ?? "").trim(),
      duration: parseDuration(raw.duration ?? raw.minutes),
      description: String(raw.description ?? raw.content ?? "").trim(),
    };
  }

  const line = String(raw ?? "").trim();
  const [head, ...rest] = line.split(":");
  const description = rest.join(":").trim();

  const durationMatch = head.match(/\(([^)]*\d+[^)]*)\)/);
  const duration = durationMatch ? parseDuration(durationMatch[1]) : 0;
  const name = head.replace(/\([^)]*\)/, "").trim();

  return { name: name || line, duration, description };
};

export const toActivities = (raw: unknown): LessonActivity[] => {
  if (Array.isArray(raw)) return raw.map(parseActivity).filter((a) => a.name);
  return toLines(raw).map(parseActivity).filter((a) => a.name);
};

const humanSize = (value: unknown): string => {
  if (typeof value === "string") return value.trim();
  if (typeof value !== "number" || value <= 0) return "";
  const units = ["B", "KB", "MB", "GB"];
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
  return match ? match[1].toLowerCase() : "";
};

const toMaterial = (raw: any, index: number): LessonMaterial => {
  const name = String(raw?.name ?? raw?.file_name ?? raw?.title ?? "").trim();
  const url = String(raw?.url ?? raw?.link ?? raw?.file_url ?? raw?.path ?? "");
  return {
    id: raw?.id ?? index,
    file_id: raw?.file_id ?? raw?.file?.id ?? raw?.id ?? index,
    name: name || `Tài liệu ${index + 1}`,
    url,
    size: humanSize(raw?.size ?? raw?.file_size),
    ext: extOf(name, url),
  };
};

export const toMaterials = (raw: unknown): LessonMaterial[] => {
  if (!Array.isArray(raw)) return [];
  return raw.map(toMaterial);
};

const firstString = (...values: unknown[]): string => {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
};

const firstNumber = (...values: unknown[]): number => {
  for (const value of values) {
    if (typeof value === "number" && !Number.isNaN(value)) return value;
  }
  return 0;
};

export const toLessonDetail = (raw: any): LessonDetail => {
  const data = raw ?? {};
  const start = toTime(data.start_time);
  const end = toTime(data.end_time);
  const classRoom = data.class_room ?? data.class ?? {};
  const course = classRoom.course ?? data.course ?? {};

  const unitLabel = firstString(
    data.unit,
    data.unit_name,
    data.lesson_no ? `Unit ${data.lesson_no}` : "",
  );

  return {
    id: data.id ?? 0,
    class_room_id: data.class_room_id ?? classRoom.id ?? 0,
    lesson_plan_id: data.lesson_plan_id ?? null,
    avatar: firstString(data.avatar, data.lesson_plan?.avatar, classRoom.avatar),
    lesson_no: data.lesson_no ?? 0,
    lesson_title: firstString(data.lesson_title, data.title, data.name),
    unit: unitLabel,
    class_name: firstString(data.class_name, classRoom.name),
    course_name: firstString(data.course_name, course.name),
    level: firstString(data.level, course.level, classRoom.level),
    audience: firstString(data.audience, data.target, course.target),
    room: firstString(data.room, classRoom.room?.name, data.room_name),
    status: firstString(data.status),
    date: toDate(data.lesson_date ?? data.date),
    start_time: start,
    end_time: end,
    duration: firstNumber(data.duration) || durationMinutes(start, end),
    objectives: toLines(data.objectives ?? data.objective),
    activities: toActivities(data.activities),
    materials: toMaterials(data.materials ?? data.documents ?? data.attachments),
    lesson_note: firstString(data.lesson_note, data.personal_note, data.note),
    completion_rate: Math.round(
      firstNumber(data.completion_rate, data.stats?.completion_rate),
    ),
    created_at: toDate(data.created_at),
    updated_at: toDate(data.updated_at),
    updated_by: firstString(data.updated_by?.full_name, data.updated_by),
  };
};
