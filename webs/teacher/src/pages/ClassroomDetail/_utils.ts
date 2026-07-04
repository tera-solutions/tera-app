import { toDate, toTime } from "_common/utils/schedule";
import { toClassroom } from "pages/Classroom/_utils";

import type {
  AttendanceRecord,
  AttendanceStatus,
  ClassMaterial,
  ClassroomDetail,
  ClassroomDetailResult,
  ClassSession,
  ClassStatistics,
  ClassStudent,
  ClassStudentResult,
  ScheduleSlot,
} from "./_interface";

const toStatistics = (raw: any): ClassStatistics => {
  const s = raw?.students ?? {};
  const o = raw?.operational ?? {};
  return {
    students: {
      total: s.total ?? 0,
      active: s.active ?? 0,
      reserved: s.reserved ?? 0,
      completed: s.completed ?? 0,
      dropped: s.dropped ?? 0,
    },
    operational: {
      total_sessions: o.total_sessions ?? 0,
      completed_sessions: o.completed_sessions ?? 0,
      pending_sessions: o.pending_sessions ?? 0,
      completion_rate: o.completion_rate ?? 0,
      avg_attendance_rate: o.avg_attendance_rate ?? 0,
    },
  };
};

const toScheduleSlots = (raw: any[] | null | undefined): ScheduleSlot[] =>
  (raw ?? []).map((item) => ({
    weekday: item.weekday ?? 0,
    start_time: toTime(item.start_time),
    end_time: toTime(item.end_time),
  }));

export const toClassroomDetail = (raw: any): ClassroomDetailResult => {
  const cls = raw?.class ?? {};
  const statistics = toStatistics(raw?.statistics);
  const base = toClassroom(cls);

  const detail: ClassroomDetail = {
    ...base,
    student_count: statistics.students.total,
    completion_rate: statistics.operational.completion_rate,
    code: cls.code ?? "",
    teacher_name: cls.teacher?.full_name ?? "",
    learning_type: cls.learning_type ?? "",
    start_date: cls.start_date ?? "",
    end_date: cls.end_date ?? "",
    description: cls.description ?? "",
    lesson_plan_name: cls.lesson_plan?.name ?? "",
    schedules: toScheduleSlots(cls.schedules),
  };

  return { detail, statistics };
};

/** Calendar rows (`/edu/timetable/calendar`) — nested session objects. */
export const toClassSessions = (raw: any[] | null | undefined): ClassSession[] =>
  (raw ?? []).map((item) => ({
    id: item.id ?? 0,
    session_no: item.session_no ?? null,
    name: item.name ?? item.class?.name ?? "",
    date: toDate(item.session_date),
    start_time: toTime(item.start_time),
    end_time: toTime(item.end_time),
    status: item.status ?? "",
  }));

const ATTENDANCE_STATUS: Record<string, AttendanceStatus> = {
  present: "present",
  absent: "absent",
  late: "late",
  excused: "excused",
};

export const toAttendanceRecords = (
  raw: any[] | null | undefined,
): AttendanceRecord[] =>
  (raw ?? []).map((item) => ({
    id: item.id ?? 0,
    student_id: item.student_id ?? item.student?.id ?? 0,
    student_name: item.student?.name ?? "",
    student_code: item.student?.code ?? "",
    status: ATTENDANCE_STATUS[item.status] ?? "other",
    status_label: item.status_label ?? "",
    session_name: item.session?.name ?? "",
  }));

const toClassStudent = (raw: any): ClassStudent => ({
  id: raw.id ?? 0,
  code: raw.code ?? "",
  name: raw.name ?? "",
  avatar: raw.avatar ?? "",
  dob: raw.dob ?? "",
  email: raw.email ?? "",
  phone: raw.phone ?? "",
  status: raw.status ?? "",
  avg_score: raw.avg_score ?? null,
  attendance_rate: raw.attendance_rate ?? null,
});

export const toClassStudentResult = (raw: any): ClassStudentResult => {
  const items = (raw?.items ?? []).map(toClassStudent);
  const pagination = raw?.pagination ?? {};
  return {
    items,
    total: pagination.total ?? items.length,
    page: pagination.current_page ?? 1,
    per_page: pagination.per_page ?? items.length,
  };
};

const formatFileSize = (bytes: number | null | undefined): string => {
  if (!bytes) return "";
  const units = ["B", "KB", "MB", "GB"];
  let value = bytes;
  let unitIndex = 0;
  while (value >= 1024 && unitIndex < units.length - 1) {
    value /= 1024;
    unitIndex++;
  }
  return `${value.toFixed(unitIndex > 0 && value < 10 ? 1 : 0)} ${units[unitIndex]}`;
};

const toClassMaterial = (raw: any): ClassMaterial => ({
  id: raw.id ?? 0,
  name: raw.material_name ?? "",
  type: raw.material_type ?? "",
  category: raw.category?.category_name ?? "",
  version: raw.current_version ?? 0,
  status: raw.status ?? "",
  file_id: raw.current_file?.file_id ?? null,
  file_name: raw.current_file?.file_name ?? "",
  file_size: formatFileSize(raw.current_file?.file_size),
});

/**
 * Merges the course- and lesson-plan-scoped material lists for a class
 * (`/edu/material/list?entity_type=...`), de-duplicated by id — a material
 * can legitimately be linked to both.
 */
export const toClassMaterials = (
  courseRaw: any[] | null | undefined,
  lessonPlanRaw: any[] | null | undefined,
): ClassMaterial[] => {
  const seen = new Set<number>();
  const items: ClassMaterial[] = [];

  for (const raw of [...(courseRaw ?? []), ...(lessonPlanRaw ?? [])]) {
    const material = toClassMaterial(raw);
    if (seen.has(material.id)) continue;
    seen.add(material.id);
    items.push(material);
  }

  return items;
};
