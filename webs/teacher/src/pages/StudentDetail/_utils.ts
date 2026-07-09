import type { AttendanceHistoryRow, CommentItem, CurrentClass, StudentDetail, StudentStats } from "./_interface";

export const toStudentDetail = (raw: any): StudentDetail | null => {
  if (!raw) return null;
  const profile = raw.profile ?? {};
  return {
    id: raw.id ?? 0,
    code: raw.code ?? "",
    name: raw.name ?? "",
    avatar: raw.avatar_url ?? raw.avatar ?? "",
    dob: raw.dob ?? "",
    gender: raw.gender ?? "",
    email: raw.email ?? "",
    phone: raw.phone ?? "",
    status: raw.status ?? "",
    class_name: raw.class_name ?? raw.level?.name ?? "",
    address: [profile.address, profile.district, profile.province].filter(Boolean).join(", "),
    enrolled_at: raw.enrollment_date ?? "",
    note: profile.note ?? "",
    parents: (raw.parents ?? []).map((p: any) => ({
      id: p.id ?? 0,
      name: p.name ?? "",
      phone: p.phone ?? "",
      email: p.email ?? "",
      relation: p.relation ?? "",
    })),
  };
};

export const toCurrentClass = (raw: any): CurrentClass | null => {
  if (!raw) return null;
  return {
    id: raw.id ?? 0,
    name: raw.name ?? "",
    teacher_name: raw.teacher?.full_name ?? "",
    course_id: raw.course_id ?? null,
    schedules: (raw.schedules ?? []).map((s: any) => ({
      weekday: s.weekday,
      start_time: s.start_time,
      end_time: s.end_time,
    })),
    start_date: raw.start_date ?? "",
    end_date: raw.end_date ?? "",
    status: raw.status ?? "",
  };
};

export const toStudentStats = (raw: any): StudentStats => ({
  attendance_rate: raw?.attendance_rate ?? 0,
  total_sessions: raw?.total_sessions ?? 0,
  avg_score: raw?.avg_score ?? null,
  assignment_completion: raw?.homework_completion ?? 0,
  skills: {
    listening: raw?.skills?.listening ?? 0,
    speaking: raw?.skills?.speaking ?? 0,
    reading: raw?.skills?.reading ?? 0,
    writing: raw?.skills?.writing ?? 0,
  },
});

export const toComments = (raw: any[] | null | undefined): CommentItem[] =>
  (raw ?? [])
    .filter((e) => e.comment)
    .map((e) => ({
      id: e.id ?? 0,
      content: e.comment ?? "",
      evaluated_at: e.evaluated_at ?? e.created_at ?? "",
    }));

export const toAttendanceHistory = (raw: any[] | null | undefined): AttendanceHistoryRow[] =>
  (raw ?? []).map((a) => ({
    id: a.id ?? 0,
    session_no: a.session?.session_no ?? null,
    session_name: a.session?.name ?? "",
    session_date: a.session?.session_date ?? "",
    status: a.status ?? "",
    note: a.note ?? "",
  }));
