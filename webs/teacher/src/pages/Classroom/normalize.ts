import { pick } from "_common/utils/pick";
import { toHHmm } from "_common/normalize/schedule";

import type {
  Classroom,
  ClassroomStatus,
  ClassroomSummary,
} from "./_interface";

const normalizeStatus = (raw: any): ClassroomStatus => {
  const value = String(raw ?? "").toLowerCase();
  if (
    ["inactive", "closed", "ended", "completed", "archived", "0", "false"].includes(
      value,
    )
  )
    return "inactive";
  return "active";
};

const toRate = (raw: any): number => {
  const value = Number(raw ?? 0);
  if (!Number.isFinite(value)) return 0;
  const pct = value > 0 && value <= 1 ? value * 100 : value;
  return Math.max(0, Math.min(100, Math.round(pct)));
};

/** Backend weekday convention: CN=1, Thứ 2=2 … Thứ 7=7. */
const weekdayLabel = (weekday: any): string => {
  const n = Number(weekday);
  if (n === 1) return "CN";
  if (n >= 2 && n <= 7) return `Thứ ${n}`;
  return "";
};

interface ScheduleRow {
  weekday?: number | string;
  start_time?: string;
  end_time?: string;
}

/** Day labels from the class `schedules[]` rows, e.g. "Thứ 2, Thứ 4, Thứ 6". */
const scheduleDays = (schedules: ScheduleRow[]): string => {
  const labels = Array.from(
    new Set(schedules.map((s) => weekdayLabel(s.weekday)).filter(Boolean)),
  );
  return labels.join(", ");
};

export const normalizeClassroom = (raw: any): Classroom => {
  const schedules: ScheduleRow[] = Array.isArray(raw?.schedules)
    ? raw.schedules
    : [];
  const firstSlot = schedules[0] ?? {};

  return {
    id: Number(pick(raw, ["id", "class_id", "class_room_id"]) ?? 0),
    name: pick(raw, ["name", "class_name", "class_room_name", "title"]) ?? "",
    category: pick(raw, ["category", "category.name", "object", "target"]) ?? "",
    level:
      pick(raw, [
        "level.name",
        "level",
        "level_name",
        "course.name",
        "course_name",
      ]) ?? "",
    room:
      pick(raw, [
        "room.room_name",
        "room.name",
        "room_name",
        "room.room_code",
        "room.code",
      ]) ?? "",
    branch:
      pick(raw, [
        "branch.name",
        "branch_name",
        "facility.name",
        "facility_name",
        "campus.name",
        "co_so.name",
        "location.name",
        "business.name",
      ]) ?? "",
    schedule_days:
      pick(raw, ["schedule_days", "study_days", "days", "weekdays"]) ??
      scheduleDays(schedules),
    start_time: toHHmm(
      pick(raw, ["start_time", "start_at", "begin_at"]) ?? firstSlot.start_time,
    ),
    end_time: toHHmm(
      pick(raw, ["end_time", "end_at", "finish_at"]) ?? firstSlot.end_time,
    ),
    student_count: Number(
      pick(raw, [
        "student_count",
        "students_count",
        "total_students",
        "enrolled_count",
        "statistics.students.total",
        "students.total",
        "current_capacity",
      ]) ?? 0,
    ),
    max_students: Number(
      pick(raw, [
        "max_students",
        "max_capacity",
        "capacity",
        "max_student",
        "size",
      ]) ?? 0,
    ),
    completion_rate: toRate(
      pick(raw, [
        "completion_rate",
        "attendance_rate",
        "statistics.operational.completion_rate",
        "statistics.operational.avg_attendance_rate",
        "operational.completion_rate",
        "operational.avg_attendance_rate",
        "progress",
      ]),
    ),
    status: normalizeStatus(pick(raw, ["status", "state", "is_active"])),
    cover_image:
      pick(raw, ["cover_image", "cover", "image", "thumbnail"]) ?? "",
  };
};

export const normalizeClassrooms = (raw: any): Classroom[] => {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.data ?? []);
  return (list as any[]).map(normalizeClassroom);
};

/**
 * Map the `/edu/class-room/summary` endpoint to the summary widgets. The
 * endpoint has no completion field, so `avg_completion_rate` is left undefined
 * for the caller to fill from the list.
 */
export const normalizeSummary = (
  raw: any,
): Omit<ClassroomSummary, "avg_completion_rate"> & {
  avg_completion_rate?: number;
} => {
  const completion = pick(raw, ["avg_completion_rate", "completion_rate"]);
  return {
    total_classes_managed: Number(
      pick(raw, ["total", "total_classes_managed", "total_classes"]) ?? 0,
    ),
    total_students: Number(pick(raw, ["total_students"]) ?? 0),
    active_classes: Number(
      pick(raw, ["by_status.active", "active_classes", "active"]) ?? 0,
    ),
    avg_completion_rate: completion != null ? toRate(completion) : undefined,
  };
};

/** Derive the summary widgets from the loaded classroom list. */
export const summarize = (classes: Classroom[]): ClassroomSummary => {
  const total = classes.length;
  const rated = classes.filter((c) => c.completion_rate > 0);
  return {
    total_classes_managed: total,
    total_students: classes.reduce((sum, c) => sum + c.student_count, 0),
    active_classes: classes.filter((c) => c.status === "active").length,
    avg_completion_rate: rated.length
      ? Math.round(
          rated.reduce((sum, c) => sum + c.completion_rate, 0) / rated.length,
        )
      : 0,
  };
};
