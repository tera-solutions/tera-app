import moment from "moment";

import type { ScheduleItem, ScheduleStatus } from "_common/types/schedule";

/** "HH:mm:ss" or "HH:mm" → "HH:mm". */
export const toTime = (value: string | null | undefined): string =>
  value ? value.slice(0, 5) : "";

/** A plain date stays as-is; an ISO datetime is converted to the local calendar date. */
export const toDate = (value: string | null | undefined): string => {
  if (!value) return "";
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const m = moment(value);
  return m.isValid() ? m.format("YYYY-MM-DD") : "";
};

/** Backend session status → the four UI statuses. */
export const toScheduleStatus = (
  value: string | null | undefined,
): ScheduleStatus => {
  switch (value) {
    case "cancelled":
    case "canceled":
      return "cancelled";
    case "done":
    case "completed":
    case "finished":
    case "ended":
      return "done";
    case "ongoing":
    case "in_progress":
      return "ongoing";
    default:
      return "upcoming";
  }
};

/** Dashboard `schedule_today` rows — flat keys. */
export const toScheduleItem = (raw: any): ScheduleItem => ({
  id: raw.id ?? 0,
  class_id: raw.class_id ?? 0,
  class_name: raw.class_name ?? "",
  level: raw.level ?? "",
  room: raw.room ?? "",
  branch: raw.branch ?? "",
  date: toDate(raw.date),
  start_time: toTime(raw.start_time),
  end_time: toTime(raw.end_time),
  status: toScheduleStatus(raw.status),
  lesson_plan_id: raw.lesson_plan_id ?? null,
  student_count: raw.student_count ?? 0,
  teacher_name: raw.teacher_name ?? "",
  session_no: raw.session_no ?? null,
  session_name: raw.session_name ?? "",
});

export const toScheduleItems = (raw: any[] | null | undefined): ScheduleItem[] =>
  (raw ?? []).map(toScheduleItem);

/** `/edu/timetable/calendar` rows — nested session objects (`class`, `teacher`, `room`). */
export const toCalendarItem = (raw: any): ScheduleItem => ({
  id: raw.id ?? 0,
  class_id: raw.class_id ?? raw.class?.id ?? 0,
  class_name: raw.class?.name ?? "",
  level: raw.class?.course?.name ?? "",
  room: raw.room?.name ?? "",
  branch: raw.class?.branch?.name ?? "",
  date: toDate(raw.session_date),
  start_time: toTime(raw.start_time),
  end_time: toTime(raw.end_time),
  status: toScheduleStatus(raw.status),
  lesson_plan_id: raw.lesson_plan_id ?? null,
  student_count: raw.student_count ?? 0,
  teacher_name: raw.teacher?.full_name ?? "",
  session_no: raw.session_no ?? null,
  session_name: raw.name ?? "",
});

export const toCalendarItems = (raw: any[] | null | undefined): ScheduleItem[] =>
  (raw ?? []).map(toCalendarItem);
