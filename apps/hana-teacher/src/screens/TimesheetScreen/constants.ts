import { CalendarCheck, CheckCheck, Clock3, ListChecks } from 'lucide-react-native';

export const WEEKDAY_FULL_BY_JS_DAY: Record<number, string> = {
  0: 'Chủ Nhật',
  1: 'Thứ Hai',
  2: 'Thứ Ba',
  3: 'Thứ Tư',
  4: 'Thứ Năm',
  5: 'Thứ Sáu',
  6: 'Thứ Bảy',
};

/**
 * Mockup gốc có 4 ô "Ngày công / Đi làm / Đi muộn / Vắng-Phép" kiểu chấm công
 * nhân sự — nhưng KHÔNG có API chấm công/đi trễ/vắng mặt nào cho giáo viên
 * (đã xác nhận ở BRD: HR Working Schedule không áp dụng cho Teacher chính).
 * Thay vào đó, dùng đúng dữ liệu buổi dạy thật từ `edu/timetable/calendar`
 * (cùng API `TeachingScheduleScreen` đang dùng) để tính 4 chỉ số thật.
 */
export const STATS_CONFIG = [
  { id: 'days', label: 'Ngày công', icon: CalendarCheck, color: '#0066cc' },
  { id: 'sessions', label: 'Số buổi dạy', icon: ListChecks, color: '#16A34A' },
  { id: 'hours', label: 'Tổng giờ dạy', icon: Clock3, color: '#F97316' },
  { id: 'done', label: 'Đã hoàn thành', icon: CheckCheck, color: '#9333EA' },
];

export const SHIFT_META = [
  { id: 'morning', label: 'Ca sáng', bg: '#FEF3C7', color: '#D97706', maxHour: 12 },
  { id: 'afternoon', label: 'Ca chiều', bg: '#DCFCE7', color: '#16A34A', maxHour: 18 },
  { id: 'evening', label: 'Ca tối', bg: '#F3E8FF', color: '#9333EA', maxHour: 24 },
];

export const getShiftMeta = (startTime: string) => {
  const hour = Number(startTime?.split(':')?.[0] ?? 0);
  return SHIFT_META.find((s) => hour < s.maxHour) ?? SHIFT_META[SHIFT_META.length - 1];
};
