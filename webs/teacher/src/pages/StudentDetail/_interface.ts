export type DetailTab = "overview" | "scores" | "attendance" | "assignment" | "history";

export interface StudentParent {
  id: number;
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface StudentDetail {
  id: number;
  code: string;
  name: string;
  avatar: string;
  dob: string;
  gender: string;
  email: string;
  phone: string;
  status: string;
  class_name: string;
  address: string;
  enrolled_at: string;
  note: string;
  parents: StudentParent[];
}

export interface CurrentClassSchedule {
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface CurrentClass {
  id: number;
  name: string;
  teacher_name: string;
  course_id: number | null;
  schedules: CurrentClassSchedule[];
  start_date: string;
  end_date: string;
  status: string;
}

export interface StudentStats {
  attendance_rate: number;
  total_sessions: number;
  avg_score: number | null;
  assignment_completion: number;
  skills: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

export interface CommentItem {
  id: number;
  content: string;
  evaluated_at: string;
}

export interface AttendanceHistoryRow {
  id: number;
  session_no: number | null;
  session_name: string;
  session_date: string;
  status: string;
  note: string;
}
