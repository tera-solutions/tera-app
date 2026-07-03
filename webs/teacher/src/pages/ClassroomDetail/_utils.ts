import { toDate, toTime } from "_common/utils/schedule";
import { toClassroom } from "pages/Classroom/_utils";

import type {
  AttendanceRecord,
  AttendanceStatus,
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
