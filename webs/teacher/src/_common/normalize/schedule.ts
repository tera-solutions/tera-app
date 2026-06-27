import moment from "moment";

import { pick } from "_common/utils/pick";
import type { ScheduleItem, ScheduleStatus } from "_common/types/schedule";

/** Accepts "HH:mm", "HH:mm:ss" or an ISO datetime and returns "HH:mm". */
export const toHHmm = (value: any): string => {
  if (!value) return "";
  const str = String(value);
  const m = str.match(/^(\d{2}):(\d{2})/);
  if (m) return `${m[1]}:${m[2]}`;
  const parsed = moment(str);
  return parsed.isValid() ? parsed.format("HH:mm") : "";
};

export const toDate = (value: any): string => {
  if (!value) return "";
  const str = String(value);
  // Pure date string (no time component) — use as-is to avoid timezone drift.
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // ISO datetime — the backend stores local midnight as UTC, so convert to the
  // local calendar date (e.g. "2026-06-21T17:00:00Z" → "2026-06-22" at UTC+7).
  const parsed = moment(str);
  return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
};

export const normalizeStatus = (raw: any): ScheduleStatus => {
  const value = String(raw ?? "").toLowerCase();
  if (["cancelled", "canceled", "cancel", "void"].includes(value))
    return "cancelled";
  if (["done", "completed", "finished", "ended", "locked"].includes(value))
    return "done";
  if (
    [
      "ongoing",
      "happened",
      "in_progress",
      "in-progress",
      "running",
      "active",
    ].includes(value)
  )
    return "ongoing";
  return "upcoming";
};

export const normalizeSession = (raw: any): ScheduleItem => {
  const start = pick(raw, ["start_time", "start_at", "start", "begin_at"]);
  const end = pick(raw, ["end_time", "end_at", "end", "finish_at"]);
  return {
    id: Number(pick(raw, ["id", "session_id", "lesson_id"]) ?? 0),
    class_id: Number(
      pick(raw, [
        "class.id",
        "class_room_id",
        "class_id",
        "class_room.id",
        "classroom_id",
      ]) ?? 0,
    ),
    class_name:
      pick(raw, [
        "class.name",
        "class_room.name",
        "class_name",
        "class_room_name",
        "classroom.name",
        "lesson_title",
        "title",
      ]) ?? "",
    level:
      pick(raw, [
        "level.name",
        "level_name",
        "class.course.name",
        "class_room.course.name",
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
        "class_room.branch.name",
        "co_so.name",
        "facility.name",
        "facility_name",
        "location.name",
      ]) ?? "",
    date: toDate(
      pick(raw, ["date", "lesson_date", "session_date", "start_at", start]),
    ),
    start_time: toHHmm(start),
    end_time: toHHmm(end),
    status: normalizeStatus(pick(raw, ["status", "state"])),
    lesson_plan_id:
      (pick(raw, ["lesson_plan_id", "lesson_id", "plan_id"]) as number) ?? null,
    student_count: Number(
      pick(raw, [
        "student_count",
        "students_count",
        "total_students",
        "enrolled_count",
      ]) ?? 0,
    ),
    teacher_name:
      pick(raw, ["teacher.full_name", "teacher.name", "teacher_name"]) ?? "",
    session_no:
      (pick(raw, ["session_no", "no", "index"]) as number | undefined) ?? null,
    session_name:
      pick(raw, ["name", "session_name", "session.name", "title"]) ?? "",
  };
};

export const normalizeSessions = (raw: any): ScheduleItem[] => {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.data ?? []);
  return (list as any[]).map(normalizeSession);
};
