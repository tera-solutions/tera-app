import { SESSION_RANGE_MONTHS, WEEKDAY_LABEL } from './constants';
import type {
  AttendanceClassInfo,
  AttendanceResponse,
  AttendanceRow,
  AttendanceStats,
  ClassRoomDetailResponse,
  ClassSession,
  ClassSessionResponse,
  RosterStudentResponse,
} from './types';

const toDate = (value?: string): string => (value ? value.slice(0, 10) : '');
const toTime = (value?: string): string => (value ? value.slice(0, 5) : '');

/** ±`SESSION_RANGE_MONTHS` around today, so the session list query stays bounded. */
export const getSessionDateRange = (): { date_from: string; date_to: string } => {
  const from = new Date();
  from.setMonth(from.getMonth() - SESSION_RANGE_MONTHS);
  const to = new Date();
  to.setMonth(to.getMonth() + SESSION_RANGE_MONTHS);
  return { date_from: toDate(from.toISOString()), date_to: toDate(to.toISOString()) };
};

export const toClassSessions = (raw: ClassSessionResponse[] | null | undefined): ClassSession[] =>
  (raw ?? []).map((item) => ({
    id: item.id,
    sessionNo: item.session_no ?? null,
    name: item.name ?? '',
    date: toDate(item.session_date),
    startTime: toTime(item.start_time),
    endTime: toTime(item.end_time),
    status: item.status ?? '',
  }));

/** Today's/nearest-upcoming session first, then nearest-past — matches the web page. */
export const sortSessionsByProximity = (sessions: ClassSession[]): ClassSession[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const rank = (date: string): [number, number] => {
    if (!date) return [1, Number.MAX_SAFE_INTEGER];
    const diffDays = Math.round((new Date(date).getTime() - today.getTime()) / 86400000);
    return diffDays >= 0 ? [0, diffDays] : [1, -diffDays];
  };

  return [...sessions].sort((a, b) => {
    const [groupA, valA] = rank(a.date);
    const [groupB, valB] = rank(b.date);
    return groupA - groupB || valA - valB;
  });
};

export const toClassInfo = (raw: ClassRoomDetailResponse | undefined): AttendanceClassInfo | undefined => {
  const cls = raw?.data?.class;
  if (!cls) return undefined;

  const scheduleDays = Array.from(
    new Set((cls.schedules ?? []).map((s) => WEEKDAY_LABEL[s.weekday ?? 0]).filter(Boolean)),
  ).join(', ');

  return {
    id: cls.id,
    name: cls.name ?? '',
    room: cls.room?.name ?? '',
    branch: cls.branch?.name ?? cls.business?.name ?? '',
    scheduleDays,
  };
};

const toRosterAvatar = (raw: RosterStudentResponse): string =>
  `https://i.pravatar.cc/150?img=${(raw.id % 50) + 1}`;

/**
 * Builds the editable grid rows from the full class roster plus whatever
 * attendance records already exist for the selected session. Students with
 * no record yet are left unmarked (`status: null`) so the teacher has to
 * actively mark each one — an untouched session shouldn't silently save as
 * "everyone present".
 */
export const toAttendanceRows = (
  roster: RosterStudentResponse[],
  records: AttendanceResponse[],
): AttendanceRow[] => {
  const byStudent = new Map(records.map((r) => [r.student_id, r]));
  return roster.map((student) => {
    const record = byStudent.get(student.id);
    return {
      student_id: student.id,
      name: student.name,
      avatar: student.avatar || toRosterAvatar(student),
      code: student.code ?? '',
      record_id: record?.id ?? null,
      status: record?.status ?? null,
      dirty: false,
    };
  });
};

export const summarizeAttendance = (rows: AttendanceRow[]): AttendanceStats => ({
  total: rows.length,
  present: rows.filter((r) => r.status === 'present').length,
  late: rows.filter((r) => r.status === 'late').length,
  absent: rows.filter((r) => r.status === 'absent').length,
});
