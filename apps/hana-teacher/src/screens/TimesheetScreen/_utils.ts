import { WEEKDAY_FULL_BY_JS_DAY } from './constants';

const pad2 = (n: number): string => String(n).padStart(2, '0');
const toTime = (v?: string): string => (v ? v.slice(0, 5) : '');
const toDate = (v?: string): string => (v ? v.slice(0, 10) : '');

export interface TimesheetSession {
  id: number;
  classId: number;
  className: string;
  level: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
  sessionName: string;
}

/** Khớp field `edu/timetable/calendar` giống `TeachingScheduleScreen/_utils.ts`. */
export const toTimesheetSession = (raw: any): TimesheetSession => ({
  id: raw?.id ?? 0,
  classId: raw?.class_id ?? raw?.class?.id ?? 0,
  className: raw?.class?.name ?? '',
  level: raw?.class?.course?.name ?? '',
  date: toDate(raw?.session_date),
  startTime: toTime(raw?.start_time),
  endTime: toTime(raw?.end_time),
  status: raw?.status || 'upcoming',
  sessionName: raw?.name ?? '',
});

export const toTimesheetSessions = (raw: any[] | null | undefined): TimesheetSession[] =>
  (raw ?? []).map(toTimesheetSession);

export const durationMinutes = (start: string, end: string): number => {
  if (!start || !end) return 0;
  const [sh, sm] = start.split(':').map(Number);
  const [eh, em] = end.split(':').map(Number);
  return Math.max(eh * 60 + em - (sh * 60 + sm), 0);
};

export const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m}m`;
  if (m <= 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const getMonthRange = (year: number, month: number) => {
  const from = new Date(year, month, 1);
  const to = new Date(year, month + 1, 0);
  const fmt = (d: Date) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  return { dateFrom: fmt(from), dateTo: fmt(to) };
};

export const formatMonthLabel = (year: number, month: number) => `${pad2(month + 1)}/${year}`;

export const formatDayLabel = (dateStr: string) => {
  const d = new Date(`${dateStr}T00:00:00`);
  if (Number.isNaN(d.getTime())) return { weekday: '', day: '', isWeekend: false };
  return {
    weekday: WEEKDAY_FULL_BY_JS_DAY[d.getDay()],
    day: pad2(d.getDate()),
    isWeekend: d.getDay() === 0 || d.getDay() === 6,
  };
};

export const groupSessionsByDate = (sessions: TimesheetSession[]) => {
  const map = new Map<string, TimesheetSession[]>();
  sessions.forEach((s) => {
    if (!map.has(s.date)) map.set(s.date, []);
    map.get(s.date)!.push(s);
  });
  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, items]) => ({
      date,
      items: items.sort((a, b) => a.startTime.localeCompare(b.startTime)),
    }));
};
