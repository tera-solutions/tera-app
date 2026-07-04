export type ClassroomView = "list" | "grid";

export type ClassroomStatus =
  | "draft"
  | "upcoming"
  | "active"
  | "suspended"
  | "completed";

export interface Classroom {
  id: number;
  name: string;
  category: string;
  level: string;
  room: string;
  branch: string;
  schedule_days: string;
  start_time: string;
  end_time: string;
  student_count: number;
  max_students: number;
  completion_rate: number;
  status: ClassroomStatus;
  cover_image: string;
  course_id: number | null;
  lesson_plan_id: number | null;
}

export interface ClassroomSummary {
  total_classes_managed: number;
  total_students: number;
  active_classes: number;
  avg_completion_rate: number;
}

export interface ClassroomFilters {
  search: string;
  status: ClassroomStatus | "";
  level: string | "";
}

/** Kept in sync with the sortable columns ClassService::paginate() allows. */
export type ClassroomSortBy = "created_at" | "name" | "start_date" | "status";

export type ClassroomSortDir = "asc" | "desc";
