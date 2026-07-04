import type {
  AttendanceStatus,
  DetailTab,
  StudentRowStatus,
} from "./_interface";

export const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "students", label: "Danh sách học viên" },
  { key: "attendance", label: "Điểm danh" },
  { key: "schedule", label: "Lịch học" },
  { key: "homework", label: "Bài tập" },
  { key: "scores", label: "Điểm số" },
  { key: "comments", label: "Nhận xét" },
  { key: "documents", label: "Tài liệu" },
  { key: "history", label: "Lịch sử lớp học" },
];

/** Tabs backed by a real teacher endpoint; the rest render a "coming soon" state. */
export const SUPPORTED_TABS: DetailTab[] = ["attendance", "schedule"];

export const CLASS_STATUS: Record<
  string,
  { label: string; badge: string }
> = {
  active: { label: "Đang học", badge: "bg-emerald-50 text-emerald-600" },
  studying: { label: "Đang học", badge: "bg-emerald-50 text-emerald-600" },
  upcoming: { label: "Sắp khai giảng", badge: "bg-sky-50 text-brand" },
  completed: { label: "Kết thúc", badge: "bg-slate-100 text-slate-500" },
  ended: { label: "Kết thúc", badge: "bg-slate-100 text-slate-500" },
  suspended: { label: "Tạm nghỉ", badge: "bg-amber-50 text-amber-600" },
  inactive: { label: "Tạm nghỉ", badge: "bg-amber-50 text-amber-600" },
};

export const getClassStatus = (status: string) =>
  CLASS_STATUS[status?.toLowerCase()] ?? {
    label: status || "—",
    badge: "bg-slate-100 text-slate-500",
  };

export const LEARNING_TYPE_LABEL: Record<string, string> = {
  scheduled: "Theo lịch cố định",
  online: "Online",
  offline: "Tại trung tâm",
  hybrid: "Kết hợp",
};

export const ATTENDANCE_STYLE: Record<
  AttendanceStatus,
  { label: string; badge: string, button: string }
> = {
  present: { label: "Có mặt", badge: "bg-emerald-50 text-emerald-600", button: "text-emerald-600 bg-transparent hover:bg-emerald-600 border border-emerald-600" },
  absent: { label: "Vắng", badge: "bg-red-50 text-red-500", button: "text-red-600 bg-transparent hover:bg-red-600 border border-red-600" },
  late: { label: "Muộn", badge: "bg-amber-50 text-amber-600", button: "text-amber-600 bg-transparent hover:bg-amber-600 border border-amber-600" },
  excused: { label: "Có phép", badge: "bg-sky-50 text-brand", button: "text-brand bg-transparent hover:bg-brand border border-brand" },
  other: { label: "Khác", badge: "bg-slate-100 text-slate-500", button: "text-slate-600 bg-transparent hover:bg-slate-600 border border-slate-600" },
};

export const STUDENT_STATUS_OPTIONS: {
  value: StudentRowStatus;
  label: string;
}[] = [
  { value: "active", label: "Đang học" },
  { value: "suspended", label: "Bảo lưu" },
  { value: "dropped", label: "Nghỉ" },
];

const STUDENT_STATUS_STYLE: Record<string, { label: string; badge: string }> = {
  active: { label: "Đang học", badge: "bg-emerald-50 text-emerald-600" },
  studying: { label: "Đang học", badge: "bg-emerald-50 text-emerald-600" },
  suspended: { label: "Bảo lưu", badge: "bg-amber-50 text-amber-600" },
  reserved: { label: "Bảo lưu", badge: "bg-amber-50 text-amber-600" },
  completed: { label: "Hoàn thành", badge: "bg-sky-50 text-brand" },
  dropped: { label: "Nghỉ", badge: "bg-red-50 text-red-500" },
  inactive: { label: "Nghỉ", badge: "bg-red-50 text-red-500" },
};

export const getStudentStatus = (status: string) =>
  STUDENT_STATUS_STYLE[status?.toLowerCase()] ?? {
    label: status || "—",
    badge: "bg-slate-100 text-slate-500",
  };

export const WEEKDAY_LABEL: Record<number, string> = {
  1: "Chủ nhật",
  2: "Thứ 2",
  3: "Thứ 3",
  4: "Thứ 4",
  5: "Thứ 5",
  6: "Thứ 6",
  7: "Thứ 7",
};
