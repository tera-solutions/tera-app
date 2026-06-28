/* Lesson (Bài học) interfaces — theo data thật edu/lesson/list */

export interface ILessonClassRef {
  id: number;
  name?: string;
  code?: string;
}

export interface ILessonTeacherRef {
  id: number;
  name?: string;
  full_name?: string;
}

export interface ILessonRoomRef {
  id: number;
  name?: string;
  room_name?: string;
  room_code?: string;
}

export interface ILesson {
  id?: number;
  class_room_id?: number;
  lesson_plan_id?: number | null;
  lesson_plan_lesson_id?: number | null;
  lesson_no?: number;
  lesson_title?: string;
  lesson_date?: string; // ISO datetime / YYYY-MM-DD
  start_time?: string; // "HH:mm:ss"
  end_time?: string; // "HH:mm:ss"
  room_id?: number | null;
  teacher_id?: number | null;
  objective?: string | null;
  vocabulary?: string | null;
  grammar?: string | null;
  activities?: string | null;
  homework?: string | null;
  lesson_note?: string | null;
  status?: string; // upcoming | ongoing | completed | cancelled
  is_locked?: boolean;
  completed_at?: string | null;
  locked_at?: string | null;
  class?: ILessonClassRef | null;
  teacher?: ILessonTeacherRef | null;
  room?: ILessonRoomRef | null;
  created_at?: string;
  updated_at?: string;
}

export interface ILessonForm {
  class_room_id: string;
  lesson_no: string;
  lesson_title: string;
  lesson_date: string;
  start_time: string;
  end_time: string;
  teacher_id: string;
  room_id: string;
  objective: string;
  vocabulary: string;
  grammar: string;
  activities: string;
  homework: string;
  lesson_note: string;
  status: string;
}

/** Map trạng thái bài học → màu badge (không có trong metadata). Nhãn dùng i18n lesson.status_*. */
export const LESSON_STATUSES = [
  "scheduled",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "locked",
] as const;

export const LESSON_STATUS_COLOR: Record<
  string,
  { color: string; backgroundColor: string }
> = {
  scheduled: { color: "#2563eb", backgroundColor: "#dbeafe" },
  confirmed: { color: "#0891b2", backgroundColor: "#cffafe" },
  in_progress: { color: "#d97706", backgroundColor: "#fef3c7" },
  completed: { color: "#16a34a", backgroundColor: "#dcfce7" },
  cancelled: { color: "#dc2626", backgroundColor: "#fee2e2" },
  locked: { color: "#6b7280", backgroundColor: "#f3f4f6" },
};
