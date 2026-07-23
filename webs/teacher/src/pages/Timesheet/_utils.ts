import type { CalendarCardEvent } from "_common/components/CalendarCard";
import { toDate } from "_common/utils/schedule";
import { getClassColorHex } from "pages/Schedule/constants";

import type { TimesheetSessionRow, TimesheetSummary, WeekBucket } from "./_interface";

/** "YYYY-MM-DD" → Date theo giờ LOCAL (tránh lệch timezone của new Date("YYYY-MM-DD")). */
const parseLocalDate = (dateStr: string | null): Date | null => {
  const [y, m, d] = String(dateStr ?? "").split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

/**
 * Định dạng ĐỒNG HỒ "H.Mh" = giờ.phút. `2.5h` = 2 giờ 5 phút (KHÔNG phải 2.5 giờ).
 * Nhận SỐ GIỜ thập phân (vd 2.5 = 2 tiếng 30 phút) và quy đổi hiển thị.
 */
export const formatDuration = (hours: number): string => {
  const totalMinutes = Math.max(0, Math.round(hours * 60));
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}.${m}h`;
};

const WEEKDAYS = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export const weekdayLabel = (dateStr: string | null): string => {
  const d = parseLocalDate(dateStr);
  return d ? WEEKDAYS[d.getDay()] : "—";
};

export const pct = (part: number, total: number): number =>
  total > 0 ? Math.round((part / total) * 100) : 0;

/** ✅ Khớp `TimesheetSessionResource` (`v1/hr/timesheet/list`). */
export const toTimesheetSession = (raw: any): TimesheetSessionRow => ({
  id: raw.id,
  code: raw.code,
  // BE trả `session_date` dạng ISO datetime (midnight local đã chuyển UTC) —
  // chuẩn hóa về "YYYY-MM-DD" local ngay từ đây để mọi chỗ downstream (weekday,
  // gom giờ theo tuần, event lịch tháng) đọc cùng một ngày, khớp với bảng/drawer.
  sessionDate: toDate(raw.session_date) || null,
  startTime: raw.start_time ?? null,
  endTime: raw.end_time ?? null,
  hours: Number(raw.hours ?? 0) || 0,
  status: raw.status,
  classId: raw.class_id ?? null,
  className: raw.class_name ?? null,
  learningType: raw.learning_type ?? null,
  roomName: raw.room_name ?? null,
  presentCount: Number(raw.present_count ?? 0) || 0,
  absentCount: Number(raw.absent_count ?? 0) || 0,
  attendancesCount: Number(raw.attendances_count ?? 0) || 0,
  averageRating: raw.average_rating ?? null,
});

export const toTimesheetSessions = (raw: any): TimesheetSessionRow[] =>
  (raw?.data?.items ?? []).map(toTimesheetSession);

/** ✅ Khớp `TimesheetService::summary` (`v1/hr/timesheet/summary`). */
export const toTimesheetSummary = (raw: any): TimesheetSummary => ({
  totalSessions: Number(raw?.data?.total_sessions ?? 0) || 0,
  totalHours: Number(raw?.data?.total_hours ?? 0) || 0,
  hoursByType: raw?.data?.hours_by_type ?? {},
  attendanceRate: raw?.data?.attendance_rate ?? null,
  averageRating: raw?.data?.average_rating ?? null,
});

const startOfDayLocal = (d: Date): Date => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};

/** Đầu tuần = Thứ 2. */
const startOfWeekLocal = (d: Date): Date => {
  const x = startOfDayLocal(d);
  const dow = x.getDay() === 0 ? 7 : x.getDay();
  x.setDate(x.getDate() - (dow - 1));
  return x;
};

const pad2 = (n: number) => String(n).padStart(2, "0");

/** Khoảng ngày gọn: cùng tháng → "01 - 04/07", khác tháng → "28/06 - 04/07". */
const formatDateRange = (start: Date, end: Date): string => {
  const sd = pad2(start.getDate());
  const ed = pad2(end.getDate());
  const sm = pad2(start.getMonth() + 1);
  const em = pad2(end.getMonth() + 1);
  return sm === em ? `(${sd} - ${ed}/${em})` : `(${sd}/${sm} - ${ed}/${em})`;
};

/** Gom tổng giờ theo TUẦN trong [range.from, range.to] (đầu tuần = Thứ 2). */
export const groupHoursByWeek = (
  items: TimesheetSessionRow[],
  range: { from: Date; to: Date },
): WeekBucket[] => {
  const from = startOfWeekLocal(range.from);
  const rangeFrom = startOfDayLocal(range.from);
  const to = startOfDayLocal(range.to);
  const buckets: WeekBucket[] = [];
  let cursor = new Date(from);
  let i = 0;
  while (cursor <= to) {
    const next = new Date(cursor);
    next.setDate(next.getDate() + 7);
    let hours = 0;
    for (const it of items) {
      const d = parseLocalDate(it.sessionDate);
      if (d && d >= cursor && d < next) hours += it.hours;
    }
    const weekStart = cursor < rangeFrom ? rangeFrom : cursor;
    const weekEndRaw = new Date(next);
    weekEndRaw.setDate(weekEndRaw.getDate() - 1);
    const weekEnd = weekEndRaw > to ? to : weekEndRaw;
    buckets.push({
      label: `Tuần ${i + 1}`,
      dateLabel: formatDateRange(weekStart, weekEnd),
      hours,
    });
    cursor = next;
    i += 1;
  }
  return buckets;
};

/** Map buổi dạy → sự kiện cho `CalendarCard` dùng chung, màu theo lớp học (`getClassColorHex`). */
export const toTimesheetCalendarCardEvents = (
  items: TimesheetSessionRow[],
): CalendarCardEvent<TimesheetSessionRow>[] =>
  items
    .filter((it) => it.sessionDate)
    .map((it) => {
      const color = getClassColorHex(it.classId ?? 0);
      return {
        id: it.id,
        date: it.sessionDate as string,
        title: `${it.startTime?.slice(0, 5) ?? ""} ${it.className ?? ""}`.trim(),
        color: color.color,
        backgroundColor: color.backgroundColor,
        item: it,
      };
    });

/** Tổng present/absent trong danh sách hiện tại — dùng cho donut "Tổng hợp tháng". */
export const summarizeAttendance = (items: TimesheetSessionRow[]) => {
  let present = 0;
  let absent = 0;
  let other = 0;
  for (const it of items) {
    present += it.presentCount;
    absent += it.absentCount;
    other += Math.max(0, it.attendancesCount - it.presentCount - it.absentCount);
  }
  return { present, absent, other, total: present + absent + other };
};
