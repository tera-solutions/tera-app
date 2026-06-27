// ── UI types (dùng trong component) ───────────────────────────

export type ClassDetailTab =
  | 'overview'
  | 'students'
  | 'schedule'
  | 'lesson'
  | 'homework'
  | 'evaluation';

export interface ClassDetail {
  id: string;
  name: string;
  subject: string;
  level: string;
  schedule: string;
  room: string;
  image: number;
  color: string;
  isActive: boolean;
  totalStudents: number;
  attendanceCount: number;
  lessonCount: number;
  homeworkCount: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  excused: number;
  total: number;
}

export interface NextLesson {
  title: string;
  subtitle: string;
  dateLabel: string;
  time: string;
  image: number;
}

export interface ClassProgress {
  completed: number;
  total: number;
  percent: number;
}

export interface Announcement {
  id: string;
  text: string;
}

// ── API response types (từ /v1/edu/class-room/detail/:id) ──────

export interface ClassRoomScheduleApi {
  id?: number;
  class_id?: number;
  weekday?: number; // 2=T2, 3=T3, 4=T4, 5=T5, 6=T6, 7=T7, 8=CN
  start_time?: string; // "HH:mm:ss"
  end_time?: string;
}

export interface ClassRoomDetailApi {
  id: number;
  code?: string;
  name: string;
  course_id?: number;
  course?: { id: number; code?: string; name: string };
  teacher_id?: number | null;
  teacher?: { id: number; name: string } | null;
  room_id?: number | null;
  room?: { id?: number; name?: string } | null;
  learning_type?: string; // "self_learning" | "offline" | "online"
  start_date?: string;
  end_date?: string | null;
  status?: string; // "upcoming" | "active" | "suspended"
  min_capacity?: number | null;
  max_capacity?: number | null;
  schedules?: ClassRoomScheduleApi[];
  description?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ClassRoomStatistics {
  students: {
    total: number;
    active: number;
    reserved: number;
    completed: number;
    dropped: number;
  };
  operational: {
    total_sessions: number;
    completed_sessions: number;
    pending_sessions: number;
    completion_rate: number;
    avg_attendance_rate: number;
  };
  financial: {
    total_revenue: number;
    recognized_revenue: number;
    debt: number;
    refunds: number;
  };
}

export interface ClassRoomDetailResponse {
  success: boolean;
  msg?: string;
  code?: number;
  errors?: unknown;
  data?: {
    class: ClassRoomDetailApi;
    statistics: ClassRoomStatistics;
  };
}
