// ─── API types ────────────────────────────────────────────────────────────────

export type LessonApiStatus =
  | 'upcoming'
  | 'ongoing'
  | 'completed'
  | 'cancelled';

export interface LessonClassInfo {
  id: number;
  name: string;
  code: string;
}

export interface LessonTeacherInfo {
  id: number;
  name: string;
}

export interface LessonRoomInfo {
  id: number;
  name: string;
}

export interface LessonResponse {
  id: number;
  class_room_id: number;
  lesson_plan_id?: number | null;
  lesson_plan_lesson_id?: number | null;
  lesson_no: number;
  lesson_title: string;
  lesson_date: string;           // ISO datetime UTC
  start_time: string;            // "HH:mm:ss"
  end_time: string;              // "HH:mm:ss"
  room_id?: number | null;
  teacher_id?: number | null;
  objective?: string | null;
  vocabulary?: string | null;
  grammar?: string | null;
  activities?: string | null;
  homework?: string | null;
  lesson_note?: string | null;
  status: LessonApiStatus;
  is_locked: boolean;
  completed_at?: string | null;
  locked_at?: string | null;
  class?: LessonClassInfo | null;
  teacher?: LessonTeacherInfo | null;
  room?: LessonRoomInfo | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

// ─── UI types ─────────────────────────────────────────────────────────────────

export interface LessonStats {
  total: number;
  completed: number;
  upcoming: number;
  ongoing: number;
}
