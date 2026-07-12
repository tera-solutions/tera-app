export type LessonDetailTab = 'overview' | 'materials' | 'homework';

export type LessonApiStatus = 'upcoming' | 'ongoing' | 'completed' | 'cancelled';

export type LessonActivityStatus = 'pending' | 'in_progress' | 'completed';

export interface LessonActivity {
  id: number | string;
  name: string;
  duration: number;
  description: string;
  avatar: string;
  status: LessonActivityStatus;
}

export interface LessonMaterialItem {
  id: number | string;
  file_id: number | string;
  name: string;
  url: string;
  size: string;
  ext: string;
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
  status: LessonApiStatus;
  date: string; // "DD/MM/YYYY"
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  duration: number; // minutes
  is_locked: boolean;
  objectives: string[];
  activities: LessonActivity[];
  materials: LessonMaterialItem[];
  lesson_note: string;
  completion_rate: number;
  created_at: string;
  updated_at: string;
  updated_by: string;
}
