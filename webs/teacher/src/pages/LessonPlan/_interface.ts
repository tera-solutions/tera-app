export interface LessonActivity {
  id: number | string;
  sort_order: number;
  avatar: string;
  title: string;
  description: string;
  duration: number;
  status: string; // pending, in_progress, completed
}

export interface Lesson {
  id: number;
  class_room_id: number;
  lesson_plan_id: number | null;
  lesson_no: number;
  lesson_title: string;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  duration: number; // minutes (derived)
  status: string; // raw backend value (see `lesson_status` metadata)
  is_locked: boolean;
  objective: string; // multiple values joined by ";"
  activities: LessonActivity[];
  lesson_note: string;
}

/** A lesson template (edu_lesson_plan_lessons) belonging to a plan — distinct from the classroom-generated `Lesson` above. */
export interface LessonTemplateSummary {
  id: number;
  lesson_no: number;
  lesson_title: string;
  duration: number;
  objective_count: number;
  activities_count: number;
  materials_count: number;
}

export interface LessonPlan {
  id: number;
  plan_code: string;
  plan_name: string;
  avatar: string;
  course_id: number | null;
  course_name: string;
  level_id: number | null;
  level_name: string;
  version: number;
  total_lessons: number;
  description: string;
  status: string; // raw backend value (see `lesson_plan_status` metadata)
  updated_at: string; // "YYYY-MM-DD"
}

export interface PlanStats {
  total: number;
  published: number;
  in_review: number; // draft + reviewing
  archived: number;
}

/** Kept in sync with the sortable columns LessonPlanService::paginate() allows. */
export type LessonPlanSortBy =
  | "created_at"
  | "plan_name"
  | "plan_code"
  | "total_lessons";

export type LessonPlanSortDir = "asc" | "desc";

export interface LessonPlanFormValues {
  plan_code: string;
  plan_name: string;
  avatar?: string;
  course_id: number | null;
  level_id?: number | null;
  description?: string;
}
