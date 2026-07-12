import type { ScheduleItem, TimesheetStats, WeekBucket, DonutData } from "./_interface";

/** "YYYY-MM-DD" → Date theo giờ LOCAL (tránh lệch timezone của new Date("YYYY-MM-DD")). */
const parseLocalDate = (dateStr: string): Date | null => {
  const [y, m, d] = String(dateStr ?? "").split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const toMinutesOfDay = (t: string | null | undefined): number | null => {
  if (!t) return null;
  const [h, m] = String(t).split(":").map(Number);
  if (Number.isNaN(h)) return null;
  return h * 60 + (m || 0);
};

/** Độ dài 1 buổi tính bằng PHÚT (0 nếu thiếu/âm). */
export const sessionMinutes = (
  item: Pick<ScheduleItem, "start_time" | "end_time">,
): number => {
  const s = toMinutesOfDay(item.start_time);
  const e = toMinutesOfDay(item.end_time);
  if (s == null || e == null) return 0;
  const diff = e - s;
  return diff > 0 ? diff : 0;
};

/**
 * Định dạng ĐỒNG HỒ "H.Mh" = giờ.phút. `2.5h` = 2 giờ 5 phút (KHÔNG phải 2.5 giờ).
 * 120→"2.0h", 125→"2.5h", 150→"2.30h", 0→"0.0h".
 */
export const formatDuration = (minutes: number): string => {
  const total = Math.max(0, Math.round(minutes));
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${h}.${m}h`;
};

const WEEKDAYS = ["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"];

export const weekdayLabel = (dateStr: string): string => {
  const d = parseLocalDate(dateStr);
  return d ? WEEKDAYS[d.getDay()] : "—";
};

/** Gom trạng thái buổi thô về 3 nhóm cho tile/donut. Heuristic — tinh chỉnh khi có metadata thật. */
export const statusGroup = (
  status: string,
): "completed" | "cancelled" | "upcoming" => {
  const s = String(status ?? "").toLowerCase();
  if (s.includes("cancel")) return "cancelled";
  if (["completed", "done", "finished", "finish"].includes(s)) return "completed";
  return "upcoming";
};

export const computeStats = (items: ScheduleItem[]): TimesheetStats => {
  let completed = 0;
  let upcoming = 0;
  let cancelled = 0;
  let totalMinutes = 0;
  for (const it of items) {
    totalMinutes += sessionMinutes(it);
    const g = statusGroup(it.status);
    if (g === "completed") completed += 1;
    else if (g === "cancelled") cancelled += 1;
    else upcoming += 1;
  }
  return { total: items.length, completed, upcoming, cancelled, totalMinutes };
};

export const pct = (part: number, total: number): number =>
  total > 0 ? Math.round((part / total) * 100) : 0;

export const donutData = (stats: TimesheetStats): DonutData => ({
  labels: ["Đã hoàn thành", "Sắp diễn ra", "Đã hủy"],
  data: [stats.completed, stats.upcoming, stats.cancelled],
  colors: ["#22c55e", "#f59e0b", "#ef4444"],
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

/** Gom tổng phút theo TUẦN trong [range.from, range.to] (đầu tuần = Thứ 2). */
export const groupMinutesByWeek = (
  items: ScheduleItem[],
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
    let minutes = 0;
    for (const it of items) {
      const d = parseLocalDate(it.date);
      if (d && d >= cursor && d < next) minutes += sessionMinutes(it);
    }
    // Ngày hiển thị: clamp đầu/cuối tuần vào trong [range.from, range.to].
    const weekStart = cursor < rangeFrom ? rangeFrom : cursor;
    const weekEndRaw = new Date(next);
    weekEndRaw.setDate(weekEndRaw.getDate() - 1); // Chủ nhật
    const weekEnd = weekEndRaw > to ? to : weekEndRaw;
    buckets.push({
      label: `Tuần ${i + 1}`,
      dateLabel: formatDateRange(weekStart, weekEnd),
      minutes,
    });
    cursor = next;
    i += 1;
  }
  return buckets;
};
