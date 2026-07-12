import {
  ActivityItem,
  AttendanceRow,
  CommentItem,
  HomeworkItem,
  ScoreItem,
  StudentDetail,
  StudentStats,
} from './types';

export function formatDate(value?: string | null): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function computeAge(dob?: string | null): number | null {
  if (!dob) return null;
  const d = new Date(dob);
  if (Number.isNaN(d.getTime())) return null;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const monthDiff = now.getMonth() - d.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < d.getDate())) age -= 1;
  return age;
}

export function toStudentDetail(raw: any): StudentDetail | undefined {
  if (!raw?.id) return undefined;
  const profile = raw.profile ?? {};
  return {
    id: raw.id,
    name: raw.name ?? '',
    studentCode: raw.code ?? '',
    birthday: formatDate(raw.dob),
    age: computeAge(raw.dob),
    gender: raw.gender === 'male' ? 'Nam' : raw.gender === 'female' ? 'Nữ' : (raw.gender ?? ''),
    className: raw.class_name ?? raw.level?.name ?? '',
    email: raw.email ?? '',
    phone: raw.phone ?? '',
    address: [profile.address, profile.district, profile.province].filter(Boolean).join(', '),
    enrolledAt: formatDate(raw.enrollment_date),
    note: profile.note ?? '',
    parents: (raw.parents ?? []).map((p: any) => ({
      id: p.id ?? 0,
      name: p.name ?? '',
      phone: p.phone ?? '',
      email: p.email ?? '',
      relation: p.relation ?? '',
    })),
  };
}

export function toStudentStats(raw: any): StudentStats {
  return {
    attendanceRate: raw?.attendance_rate ?? 0,
    totalSessions: raw?.total_sessions ?? 0,
    avgScore: raw?.avg_score ?? null,
    assignmentCompletion: raw?.homework_completion ?? 0,
    skills: {
      listening: raw?.skills?.listening ?? 0,
      speaking: raw?.skills?.speaking ?? 0,
      reading: raw?.skills?.reading ?? 0,
      writing: raw?.skills?.writing ?? 0,
    },
  };
}

export function toAttendanceRows(raw: any[] | null | undefined): AttendanceRow[] {
  return (raw ?? []).map((a) => ({
    id: a.id ?? 0,
    sessionName: a.session?.name ?? '',
    sessionDate: formatDate(a.session?.session_date),
    sessionDateRaw: a.session?.session_date ?? '',
    status: a.status ?? '',
    note: a.note ?? '',
  }));
}

export function toComments(raw: any[] | null | undefined): CommentItem[] {
  return (raw ?? [])
    .filter((e) => e.comment)
    .map((e) => ({
      id: e.id ?? 0,
      content: e.comment ?? '',
      date: formatDate(e.evaluated_at ?? e.created_at),
      dateRaw: e.evaluated_at ?? e.created_at ?? '',
    }));
}

export function toScores(raw: any[] | null | undefined): ScoreItem[] {
  return (raw ?? [])
    .filter((e) => e.score != null)
    .map((e) => ({
      id: e.id ?? 0,
      score: e.score != null ? Number(e.score) : null,
      classificationLabel: e.classification_label ?? null,
      periodLabel: e.evaluation_period_label ?? e.evaluation_period ?? null,
      date: formatDate(e.evaluated_at ?? e.created_at),
      dateRaw: e.evaluated_at ?? e.created_at ?? '',
    }))
    .sort((a, b) => b.dateRaw.localeCompare(a.dateRaw));
}

export function toHomeworkItems(raw: any[] | null | undefined): HomeworkItem[] {
  return (raw ?? []).map((a) => ({
    id: a.id ?? 0,
    title: a.assignment_name ?? '',
    dueDate: formatDate(a.due_date),
    maxScore: a.max_score ?? '',
  }));
}

/** Danh sách hoạt động gần đây tổng hợp từ 2 nguồn thật đã có sẵn (điểm danh + nhận xét) — không có API timeline riêng. */
export function buildRecentActivities(
  attendance: AttendanceRow[],
  comments: CommentItem[],
): ActivityItem[] {
  const attendanceItems: ActivityItem[] = attendance.slice(0, 5).map((a) => ({
    id: `attendance-${a.id}`,
    type: 'attendance',
    title: 'Điểm danh',
    description: a.sessionName || 'Buổi học',
    date: a.sessionDate,
    sortKey: a.sessionDateRaw,
  }));

  const commentItems: ActivityItem[] = comments.slice(0, 5).map((c) => ({
    id: `comment-${c.id}`,
    type: 'comment',
    title: 'Nhận xét mới',
    description: c.content,
    date: c.date,
    sortKey: c.dateRaw,
  }));

  return [...attendanceItems, ...commentItems]
    .sort((a, b) => b.sortKey.localeCompare(a.sortKey))
    .slice(0, 6);
}
