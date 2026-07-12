import { WEEKDAY_FULL_BY_JS_DAY, WEEKDAY_LABELS } from './constants';
import type { ScheduleDayStats, ScheduleSession, ScheduleSessionResponse, WeekDay } from './types';

const pad2 = (n: number): string => String(n).padStart(2, '0');

export const toDateKey = (d: Date): string => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const addDays = (d: Date, days: number): Date => {
  const next = new Date(d);
  next.setDate(next.getDate() + days);
  return next;
};

const toTime = (v?: string): string => (v ? v.slice(0, 5) : '');
const toDate = (v?: string): string => (v ? v.slice(0, 10) : '');

/** `/edu/timetable/calendar` rows — nested session objects (`class`, `room`). */
export const toScheduleSession = (raw: ScheduleSessionResponse): ScheduleSession => ({
  id: raw.id ?? 0,
  classId: raw.class_id ?? raw.class?.id ?? 0,
  className: raw.class?.name ?? '',
  level: raw.class?.course?.name ?? '',
  room: raw.room?.name ?? '',
  branch: raw.class?.branch?.name ?? '',
  date: toDate(raw.session_date),
  startTime: toTime(raw.start_time),
  endTime: toTime(raw.end_time),
  status: raw.status || 'upcoming',
  studentCount: raw.student_count ?? 0,
  sessionNo: raw.session_no ?? null,
  sessionName: raw.name ?? '',
});

export const toScheduleSessions = (raw: ScheduleSessionResponse[] | null | undefined): ScheduleSession[] =>
  (raw ?? []).map(toScheduleSession);

/** Monday-start week containing `date`. */
export const getWeekDays = (date: Date): WeekDay[] => {
  const day = date.getDay(); // 0=Sun..6=Sat
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const monday = addDays(date, mondayOffset);
  const todayKey = toDateKey(new Date());

  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(monday, i);
    const fullDate = toDateKey(d);
    return {
      label: WEEKDAY_LABELS[i],
      number: pad2(d.getDate()),
      fullDate,
      isToday: fullDate === todayKey,
    };
  });
};

export const formatDayHeader = (dateStr: string): string => {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return `${WEEKDAY_FULL_BY_JS_DAY[d.getDay()]}, ${pad2(d.getDate())}/${pad2(d.getMonth() + 1)}/${d.getFullYear()}`;
};

/** "08:00"–"09:30" → "1.5 giờ". */
export const durationLabel = (start: string, end: string): string => {
  if (!start || !end) return '';
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  const minutes = eh * 60 + em - (sh * 60 + sm);
  if (minutes <= 0) return '';
  const hours = minutes / 60;
  return `${hours.toFixed(1)} giờ`;
};

export const computeDayStats = (sessions: ScheduleSession[]): ScheduleDayStats => {
  const totalMinutes = sessions.reduce((sum, s) => {
    if (!s.startTime || !s.endTime) return sum;
    const [sh, sm] = s.startTime.split(':').map(Number);
    const [eh, em] = s.endTime.split(':').map(Number);
    const minutes = eh * 60 + em - (sh * 60 + sm);
    return sum + Math.max(minutes, 0);
  }, 0);

  return {
    sessionsCount: sessions.length,
    classesCount: new Set(sessions.map((s) => s.classId)).size,
    totalHoursLabel: `${(totalMinutes / 60).toFixed(1)}h`,
    doneCount: sessions.filter((s) => s.status === 'done').length,
  };
};
