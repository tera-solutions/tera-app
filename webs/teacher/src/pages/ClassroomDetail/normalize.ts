import { pick } from "_common/utils/pick";
import { toDate, toHHmm } from "_common/normalize/schedule";
import { normalizeClassroom } from "pages/Classroom/normalize";

import type {
  AttendanceRecord,
  AttendanceStatus,
  ClassroomDetail,
  ClassroomDetailResult,
  ClassSession,
  ClassStatistics,
  ClassStudent,
  ClassStudentResult,
} from "./_interface";

const num = (raw: any): number => {
  const n = Number(raw ?? 0);
  return Number.isFinite(n) ? n : 0;
};

const toRate = (raw: any): number => {
  const n = num(raw);
  const pct = n > 0 && n <= 1 ? n * 100 : n;
  return Math.round(pct * 10) / 10;
};

const normalizeStatistics = (raw: any): ClassStatistics => {
  const s = raw?.students ?? {};
  const o = raw?.operational ?? {};
  return {
    students: {
      total: num(s.total),
      active: num(s.active),
      reserved: num(s.reserved),
      completed: num(s.completed),
      dropped: num(s.dropped),
    },
    operational: {
      total_sessions: num(o.total_sessions),
      completed_sessions: num(o.completed_sessions),
      pending_sessions: num(o.pending_sessions),
      completion_rate: toRate(o.completion_rate),
      avg_attendance_rate: toRate(o.avg_attendance_rate),
    },
  };
};

export const normalizeDetail = (raw: any): ClassroomDetailResult => {
  const cls = raw?.class ?? raw ?? {};
  const base = normalizeClassroom(cls);
  const statistics = normalizeStatistics(raw?.statistics);

  const detail: ClassroomDetail = {
    ...base,
    student_count: statistics.students.total || base.student_count,
    completion_rate:
      statistics.operational.completion_rate || base.completion_rate,
    code: pick(cls, ["code", "class_code"]) ?? "",
    teacher_name:
      pick(cls, ["teacher.full_name", "teacher.name", "teacher_name"]) ?? "",
    learning_type: pick(cls, ["learning_type", "study_type"]) ?? "",
    start_date: toDate(pick(cls, ["start_date", "open_date", "begin_date"])),
    end_date: toDate(pick(cls, ["end_date", "close_date", "finish_date"])),
    description: pick(cls, ["description", "note"]) ?? "",
    lesson_plan_name:
      pick(cls, ["lesson_plan.plan_name", "lesson_plan.name"]) ?? "",
  };

  return { detail, statistics };
};

export const normalizeSession = (raw: any): ClassSession => ({
  id: num(pick(raw, ["id", "session_id"])),
  session_no: (pick(raw, ["session_no", "no", "index"]) as number) ?? null,
  name: pick(raw, ["name", "title", "session_name"]) ?? "",
  date: toDate(pick(raw, ["session_date", "date", "lesson_date", "start_at"])),
  start_time: toHHmm(pick(raw, ["start_time", "start_at", "begin_at"])),
  end_time: toHHmm(pick(raw, ["end_time", "end_at", "finish_at"])),
  status: String(pick(raw, ["status", "state"]) ?? ""),
});

export const normalizeSessions = (raw: any): ClassSession[] => {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.data ?? []);
  return (list as any[]).map(normalizeSession);
};

const numOrNull = (raw: any): number | null => {
  if (raw == null || raw === "") return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
};

export const normalizeStudent = (raw: any): ClassStudent => ({
  id: num(pick(raw, ["id", "student_id", "student.id"])),
  code: pick(raw, ["code", "student_code", "student.code"]) ?? "",
  name: pick(raw, ["name", "full_name", "student.name", "student.full_name"]) ?? "",
  avatar: pick(raw, ["avatar", "photo", "image", "student.avatar"]) ?? "",
  dob: toDate(pick(raw, ["dob", "birthday", "date_of_birth"])),
  email: pick(raw, ["email", "student.email"]) ?? "",
  phone: pick(raw, ["phone", "phone_number", "mobile", "student.phone"]) ?? "",
  status: String(pick(raw, ["status", "enrollment_status", "state"]) ?? ""),
  avg_score: numOrNull(
    pick(raw, ["avg_score", "average_score", "gpa", "score_avg"]),
  ),
  attendance_rate: numOrNull(
    pick(raw, ["attendance_rate", "attendance", "attendance_percent"]),
  ),
});

export const normalizeStudents = (raw: any): ClassStudentResult => {
  const items = raw?.items ?? raw?.data ?? (Array.isArray(raw) ? raw : []);
  const pagination = raw?.pagination ?? {};
  return {
    items: (items as any[]).map(normalizeStudent),
    total: num(pagination.total ?? items.length),
    page: num(pagination.current_page ?? 1) || 1,
    per_page: num(pagination.per_page ?? items.length) || items.length,
  };
};

const ATTENDANCE_MAP: Record<string, AttendanceStatus> = {
  present: "present",
  attended: "present",
  absent: "absent",
  late: "late",
  excused: "excused",
};

export const normalizeAttendance = (raw: any): AttendanceRecord[] => {
  const list = Array.isArray(raw) ? raw : (raw?.items ?? raw?.data ?? []);
  return (list as any[]).map((item) => {
    const statusRaw = String(pick(item, ["status", "state"]) ?? "").toLowerCase();
    return {
      id: num(pick(item, ["id"])),
      student_id: num(pick(item, ["student_id", "student.id"])),
      student_name: pick(item, ["student.name", "student_name", "name"]) ?? "",
      student_code: pick(item, ["student.code", "student_code", "code"]) ?? "",
      status: ATTENDANCE_MAP[statusRaw] ?? "other",
      status_label:
        pick(item, ["status_label", "status_name"]) ?? statusRaw ?? "",
      session_name:
        pick(item, ["session.name", "session_name", "session.session_no"]) ?? "",
    };
  });
};
