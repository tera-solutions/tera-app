export interface ScheduleItem {
  id: number;
  time: string;
  endTime: string;
  className: string;
  room: string;
  status: "upcoming" | "done";
}

export interface ClassItem {
  id: number;
  name: string;
  students: number;
  level: string;
}

export interface TodoItem {
  id: number;
  label: string;
  count: number;
  tone: "sky" | "amber" | "violet" | "rose";
}

export interface NotificationItem {
  id: number;
  title: string;
  time: string;
  unread: boolean;
}

export interface StudentItem {
  id: number;
  name: string;
  className: string;
}

export const STATS = [
  { key: "students", value: "72", label: "Học viên" },
  { key: "classes", value: "12", label: "Lớp đang dạy" },
  { key: "sessions", value: "28", label: "Buổi dạy tuần này" },
  { key: "completion", value: "85%", label: "Tỷ lệ hoàn thành" },
];

export const TODAY_SCHEDULE: ScheduleItem[] = [
  {
    id: 1,
    time: "08:00",
    endTime: "09:30",
    className: "Lớp Starters 2A",
    room: "Phòng 201 · Cơ sở 1",
    status: "upcoming",
  },
  {
    id: 2,
    time: "09:45",
    endTime: "11:15",
    className: "Lớp Movers 1B",
    room: "Phòng 203 · Cơ sở 1",
    status: "upcoming",
  },
  {
    id: 3,
    time: "13:30",
    endTime: "15:00",
    className: "Lớp Flyers 3A",
    room: "Phòng 105 · Cơ sở 1",
    status: "done",
  },
];

export const HOMEROOM_CLASSES: ClassItem[] = [
  { id: 1, name: "Starters 2A", students: 18, level: "Starters" },
  { id: 2, name: "Movers 1B", students: 22, level: "Movers" },
  { id: 3, name: "Flyers 3A", students: 20, level: "Flyers" },
];

export const MY_CLASSES: ClassItem[] = [
  { id: 1, name: "Starters 2A", students: 18, level: "Starters" },
  { id: 2, name: "Movers 1B", students: 22, level: "Movers" },
  { id: 3, name: "Flyers 3A", students: 20, level: "Flyers" },
  { id: 4, name: "Starters 1C", students: 16, level: "Starters" },
];

export const TODOS: TodoItem[] = [
  { id: 1, label: "Chấm bài tập", count: 12, tone: "sky" },
  { id: 2, label: "Nhập điểm kiểm tra", count: 5, tone: "amber" },
  { id: 3, label: "Nhận xét học viên", count: 8, tone: "violet" },
  { id: 4, label: "Duyệt giáo án", count: 2, tone: "rose" },
];

export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    title: "Họp giáo viên tháng 5",
    time: "15/05/2025 · 14:00",
    unread: true,
  },
  {
    id: 2,
    title: "Cập nhật giáo án Starters 2",
    time: "14/05/2025 · 09:30",
    unread: true,
  },
  {
    id: 3,
    title: "Nghỉ lễ 30/04 - 01/05",
    time: "28/04/2025 · 08:00",
    unread: false,
  },
];

export const GRADING_QUEUE = [
  { id: 1, className: "Movers 1B", task: "Unit 4 · Writing", count: 8 },
  { id: 2, className: "Starters 2A", task: "Unit 3 · Reading", count: 5 },
  { id: 3, className: "Flyers 3A", task: "Listening Test", count: 6 },
];

export const RECENT_LESSON_PLANS = [
  { id: 1, name: "Giáo án Starters 2 - Unit 4", updatedAt: "Hôm nay" },
  { id: 2, name: "Giáo án Movers 1 - Unit 3", updatedAt: "Hôm qua" },
  { id: 3, name: "Giáo án Flyers 3 - Unit 5", updatedAt: "2 ngày trước" },
];

export const STUDENTS: StudentItem[] = [
  { id: 1, name: "Nguyễn An", className: "Starters 2A" },
  { id: 2, name: "Trần Bình", className: "Movers 1B" },
  { id: 3, name: "Lê Chi", className: "Flyers 3A" },
  { id: 4, name: "Phạm Dũng", className: "Starters 2A" },
];

export const ATTENDANCE_SUMMARY = {
  present: 64,
  total: 72,
  rate: 89,
};

export const COMPLETION_RATE = 85;
