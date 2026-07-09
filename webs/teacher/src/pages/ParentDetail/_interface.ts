export interface ParentDetail {
  id: number;
  name: string;
  avatar: string;
  phone: string;
  email: string;
}

export interface ParentChildStats {
  attendance_rate: number;
  avg_score: number | null;
  homework_completion: number;
}

export interface ScheduleSlot {
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface ParentChild {
  id: number;
  name: string;
  avatar: string;
  relation: string;
  class_id: number;
  class_name: string;
  course_id: number | null;
}
