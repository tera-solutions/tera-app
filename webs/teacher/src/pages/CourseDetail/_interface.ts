export interface CourseDetail {
  id: number;
  name: string;
  code: string;
  thumbnail: string;
  description: string;
  duration_minutes: number;
}

export interface CourseStats {
  total_classes: number;
  active_classes: number;
  total_students: number;
  completed_students: number;
  completion_rate: number;
}

/** A course's curriculum unit — one entry per lesson template (edu_lesson_plan_lessons) on the course's lesson plan. */
export interface CurriculumItem {
  id: number;
  order: number;
  title: string;
  duration: number;
  objective_count: number;
  activities_count: number;
  materials_count: number;
}
