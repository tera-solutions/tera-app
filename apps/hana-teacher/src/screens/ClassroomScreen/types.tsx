// ── UI model (dùng trong component) ───────────────────────────
export interface ClassItem {
  id: string;
  name: string;

  level: string;
  ageGroup: string;

  room: string;
  branch: string;

  startTime: string;
  endTime: string;

  schedule: string;

  students: number;
  totalStudents: number;

  color: string;

  image: string;

  attendanceRate?: number;

  homeworkCount?: number;

  lessonPlanCount?: number;
}

// ── API response model (từ /v1/edu/class-room/list) ────────────
export interface ClassRoomSchedule {
  id?: number;
  class_id?: number;
  weekday?: number; // 2=T2, 3=T3, ..., 7=T7, 8=CN
  start_time?: string; // "HH:mm:ss"
  end_time?: string;
}

export interface ClassRoomResponse {
  id: number;
  code?: string;
  name: string;

  course_id?: number;
  course?: { id: number; code?: string; name: string };

  lesson_plan_id?: number | null;
  lesson_plan?: unknown | null;

  teacher_id?: number | null;
  teacher?: unknown | null;

  room_id?: number | null;
  room?: { id?: number; name?: string } | null;

  learning_type?: string;
  start_date?: string;
  end_date?: string | null;
  status?: string; // "upcoming" | "active" | "suspended" | ...

  min_capacity?: number | null;
  max_capacity?: number | null;

  schedules?: ClassRoomSchedule[];

  description?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface ClassRoomListResponse {
  success: boolean;
  msg?: string;
  code?: number;
  data?: {
    items: ClassRoomResponse[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}
