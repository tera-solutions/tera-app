export interface IClassRoom {
  id?: number;
  code?: string;
  name?: string;
  course_id?: number;
  course?: { id?: number; code?: string; name?: string };
  lesson_plan_id?: number | null;
  lesson_plan?: { id?: number; name?: string } | null;
  teacher_id?: number | null;
  teacher?: { id?: number; full_name?: string } | null;
  assignee_id?: number | null;
  assignee?: { id?: number; full_name?: string } | null;
  room_id?: number | null;
  room?: { id?: number; room_code?: string; room_name?: string } | null;
  learning_type?: string;
  start_date?: string | null;
  end_date?: string | null;
  status?: string;
  min_warning_capacity?: number | null;
  min_capacity?: number | null;
  max_warning_capacity?: number | null;
  max_capacity?: number | null;
  capacity_warning?: number | null;
  use_course_curriculum?: boolean;
  description?: string | null;
  schedules?: any[];
  business_id?: number;
  business?: { id?: number; name?: string; email?: string };
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface IClassRoomStatistics {
  students?: {
    total?: number;
    active?: number;
    reserved?: number;
    completed?: number;
    dropped?: number;
  };
  operational?: {
    total_sessions?: number;
    completed_sessions?: number;
    pending_sessions?: number;
    completion_rate?: number;
    avg_attendance_rate?: number;
  };
  financial?: {
    total_revenue?: number;
    recognized_revenue?: number;
    debt?: number;
    refunds?: number;
  };
}

export interface IClassSession {
  id?: number;
  class_id?: number;
  session_no?: number;
  code?: string;
  name?: string;
  session_date?: string;
  start_time?: string;
  end_time?: string;
  room_id?: number | null;
  teacher_id?: number | null;
  teacher?: { id?: number; full_name?: string; avatar?: string | null } | null;
  substitute_teacher_id?: number | null;
  substitute_teacher?: { id?: number; full_name?: string } | null;
  status?: string;
  attendance_locked?: boolean;
  revenue_amount?: string;
  note?: string | null;
  tags?: any[];
}

export interface IClassSessionForm {
  name?: string;
  session_date?: string;
  start_time?: string;
  end_time?: string;
  teacher_id?: number | string;
  substitute_teacher_id?: number | string;
  room_id?: number | string;
  note?: string;
}

export interface IClassRoomForm {
  // Tab 1: Thông tin cơ bản
  code: string;
  name: string;
  course_id?: number | string;
  lesson_plan_id?: number | string;
  teacher_id?: number | string;
  assignee_id?: number | string;
  use_course_curriculum?: boolean;
  description?: string;
  // Tab 2: Cấu hình lớp học
  learning_type?: string;
  start_date?: string;
  end_date?: string;
  room_id?: number | string;
  min_warning_capacity?: number | string;
  min_capacity?: number | string;
  max_warning_capacity?: number | string;
  max_capacity?: number | string;
}
