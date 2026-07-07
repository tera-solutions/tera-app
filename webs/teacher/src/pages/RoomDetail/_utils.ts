import { WEEKDAY_LABEL } from "./constants";
import type {
  AttendanceStatus,
  ClassInUse,
  CurrentSession,
  RoomDetailInfo,
  RoomStudent,
  ScheduleSlot,
} from "./_interface";

export const toRoomDetailInfo = (raw: any): RoomDetailInfo | null => {
  if (!raw) return null;
  return {
    id: raw.id ?? 0,
    code: raw.room_code ?? "",
    name: raw.room_name ?? "",
    type: raw.room_type ?? "",
    floor: raw.floor ?? "",
    capacity: raw.capacity ?? 0,
    status: raw.status ?? "active",
  };
};

export const toCurrentSession = (raw: any): CurrentSession | null => {
  if (!raw) return null;
  return {
    session_id: raw.session_id ?? 0,
    class_id: raw.class_id ?? 0,
    class_code: raw.class_code ?? "",
    class_name: raw.class_name ?? "",
    course_id: raw.course_id ?? null,
    level: raw.level ?? "",
    teacher_name: raw.teacher_name ?? "",
    session_date: raw.session_date ?? "",
    start_time: raw.start_time ?? "",
    end_time: raw.end_time ?? "",
    class_start_date: raw.class_start_date ?? "",
    class_end_date: raw.class_end_date ?? "",
    student_count: raw.student_count ?? 0,
    max_students: raw.max_students ?? 0,
    schedules: (raw.schedules ?? []).map((s: any) => ({
      weekday: s.weekday,
      start_time: s.start_time,
      end_time: s.end_time,
    })),
  };
};

export const toClassesInUse = (raw: any[] | null | undefined): ClassInUse[] =>
  (raw ?? []).map((c) => ({
    id: c.id ?? 0,
    code: c.code ?? "",
    name: c.name ?? "",
    teacher_id: c.teacher_id ?? null,
    teacher_name: c.teacher_name ?? "",
    student_count: c.student_count ?? 0,
    max_students: c.max_students ?? 0,
  }));

/** Distinct weekday labels from `schedules[]`, e.g. "Thứ 2, Thứ 4". */
export const scheduleDaysLabel = (schedules: ScheduleSlot[]): string =>
  Array.from(new Set(schedules.map((s) => WEEKDAY_LABEL[s.weekday]).filter(Boolean))).join(", ");

const ATTENDANCE_STATUS: Record<string, AttendanceStatus> = {
  present: "present",
  absent: "absent",
  late: "late",
  excused: "excused",
};

export const toRoomStudents = (raw: any[] | null | undefined): RoomStudent[] =>
  (raw ?? []).map((item) => ({
    id: item.student_id ?? item.student?.id ?? 0,
    name: item.student?.name ?? "",
    avatar: item.avatar_url ?? item.student?.avatar ?? "",
    status: ATTENDANCE_STATUS[item.status] ?? "other",
  }));
