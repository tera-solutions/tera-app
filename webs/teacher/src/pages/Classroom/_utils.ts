import { toTime } from "_common/utils/schedule";

import type {
  Classroom,
  ClassroomStatus,
  ClassroomSummary,
} from "./_interface";

/** `schedules[].weekday`: 1=Thứ 2 … 6=Thứ 7, 7=CN (khớp backend, xem
 * `CreateScheduleRequest`/`RoomDetail/constants.ts`). */
export const WEEKDAY_LABEL: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};

interface ScheduleRow {
  weekday?: number;
  start_time?: string;
  end_time?: string;
}

/** Distinct day labels from `schedules[]`, e.g. "Thứ 2, Thứ 4, Thứ 6". */
const scheduleDays = (schedules: ScheduleRow[]): string =>
  Array.from(
    new Set(schedules.map((s) => WEEKDAY_LABEL[s.weekday ?? 0]).filter(Boolean)),
  ).join(", ");

const toRate = (value: number | null | undefined): number =>
  Math.max(0, Math.min(100, Math.round(value ?? 0)));

export const toClassroom = (raw: any): Classroom => {
  const schedules: ScheduleRow[] = Array.isArray(raw?.schedules)
    ? raw.schedules
    : [];
  const firstSlot = schedules[0] ?? {};

  return {
    id: raw.id ?? 0,
    name: raw.name ?? "",
    category: "",
    level: raw.course?.name ?? "",
    room: raw.room?.room_name ?? raw.room?.name ?? "",
    room_id: raw.room?.id ?? raw.room_id ?? null,
    branch: raw.branch?.name ?? raw.business?.name ?? "",
    schedule_days: scheduleDays(schedules),
    start_time: toTime(firstSlot.start_time),
    end_time: toTime(firstSlot.end_time),
    end_date: raw.end_date ?? "",
    student_count: raw.total_students ?? 0,
    max_students: raw.max_capacity ?? 0,
    min_capacity: raw.min_capacity ?? null,
    min_warning_capacity: raw.min_warning_capacity ?? null,
    max_warning_capacity: raw.max_warning_capacity ?? null,
    completion_rate: toRate(raw.avg_attendance_rate),
    status: (raw.status ?? "upcoming") as ClassroomStatus,
    cover_image: raw.avatar_url ?? raw.avatar ?? "",
    course_id: raw.course_id ?? raw.course?.id ?? null,
    lesson_plan_id: raw.lesson_plan_id ?? raw.lesson_plan?.id ?? null,
  };
};

export const toClassrooms = (raw: any[] | null | undefined): Classroom[] =>
  (raw ?? []).map(toClassroom);

/**
 * Map `/edu/class-room/summary`. The endpoint has no completion field, so
 * `avg_completion_rate` is left undefined for the caller to fill from the list.
 */
export const toClassroomSummary = (
  raw: any,
): Omit<ClassroomSummary, "avg_completion_rate"> & {
  avg_completion_rate?: number;
} => ({
  total_classes_managed: raw?.total ?? 0,
  total_students: raw?.total_students ?? 0,
  active_classes: raw?.by_status?.active ?? 0,
  avg_completion_rate: undefined,
});

/** Derive the summary widgets from the loaded classroom list. */
export const summarize = (classes: Classroom[]): ClassroomSummary => {
  const rated = classes.filter((c) => c.completion_rate > 0);
  return {
    total_classes_managed: classes.length,
    total_students: classes.reduce((sum, c) => sum + c.student_count, 0),
    active_classes: classes.filter((c) => c.status === "active").length,
    avg_completion_rate: rated.length
      ? toRate(
          rated.reduce((sum, c) => sum + c.completion_rate, 0) / rated.length,
        )
      : 0,
  };
};
