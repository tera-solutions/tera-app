import type { Classroom } from "pages/Classroom/_interface";

export interface ClassStudentStats {
  total: number;
  active: number;
  reserved: number;
  completed: number;
  dropped: number;
}

export interface ClassOperationalStats {
  total_sessions: number;
  completed_sessions: number;
  pending_sessions: number;
  completion_rate: number;
  avg_attendance_rate: number;
}

export interface ClassStatistics {
  students: ClassStudentStats;
  operational: ClassOperationalStats;
}

export interface ScheduleSlot {
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface ClassroomDetail extends Classroom {
  code: string;
  teacher_name: string;
  learning_type: string;
  start_date: string;
  end_date: string;
  description: string;
  lesson_plan_name: string;
  /** Weekly recurrence (edu_class_schedules) — source for the generated session list below. */
  schedules: ScheduleSlot[];
}

export interface ClassroomDetailResult {
  detail: ClassroomDetail;
  statistics: ClassStatistics;
}

export interface ClassSession {
  id: number;
  session_no: number | null;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused" | "other";

export interface AttendanceRecord {
  id: number;
  student_id: number;
  student_name: string;
  student_code: string;
  status: AttendanceStatus;
  status_label: string;
  session_name: string;
}

export type DetailTab =
  | "students"
  | "attendance"
  | "schedule"
  | "homework"
  | "scores"
  | "comments"
  | "documents"
  | "history";

export type StudentRowStatus = "active" | "suspended" | "dropped";

export interface ClassStudent {
  id: number;
  code: string;
  name: string;
  avatar: string;
  dob: string;
  email: string;
  phone: string;
  status: string;
  avg_score: number | null;
  attendance_rate: number | null;
}

export interface ClassStudentParams {
  class_id: number;
  search?: string;
  status?: string;
  page?: number;
  per_page?: number;
}

export interface ClassStudentResult {
  items: ClassStudent[];
  total: number;
  page: number;
  per_page: number;
}

export interface ClassMaterial {
  id: number;
  name: string;
  type: string;
  category: string;
  version: number;
  status: string;
  file_id: number | null;
  file_name: string;
  file_size: string;
}
