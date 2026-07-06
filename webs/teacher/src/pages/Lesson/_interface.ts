export type LessonDetailTab =
  | "overview"
  | "content"
  | "activities"
  | "materials"
  | "notes";

export type LessonActivityStatus = "pending" | "in_progress" | "completed";

export interface LessonActivity {
  id: number | string;
  name: string;
  duration: number; // minutes, 0 when unknown
  description: string;
  avatar: string;
  status: LessonActivityStatus;
}

export interface LessonMaterial {
  id: number | string;
  file_id: number | string;
  name: string;
  url: string;
  size: string; // human readable, "" when unknown
  ext: string; // lowercased extension without dot, "" when unknown
}

export interface LessonDetail {
  id: number;
  class_room_id: number;
  lesson_plan_id: number | null;
  avatar: string;
  lesson_no: number;
  lesson_title: string;
  unit: string;
  class_name: string;
  course_name: string;
  level: string;
  audience: string;
  room: string;
  status: string; // raw backend value (see `lesson_status` metadata)
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  duration: number; // minutes
  objectives: string[];
  activities: LessonActivity[];
  materials: LessonMaterial[];
  lesson_note: string;
  completion_rate: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}
