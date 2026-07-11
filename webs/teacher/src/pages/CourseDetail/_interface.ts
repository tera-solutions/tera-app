export interface CourseDetail {
  id: number;
  name: string;
  code: string;
  thumbnail: string;
  description: string;
  duration_minutes: number;
  price_per_lesson: number;
  is_active: boolean;
}

export interface CourseStats {
  total_classes: number;
  active_classes: number;
  total_students: number;
  completed_students: number;
  completion_rate: number;
}

/** A course's curriculum unit (edu_course_curriculums) — the course's syllabus outline, independent of any lesson plan or class. */
export interface CurriculumItem {
  id: number;
  order: number;
  title: string;
  content: string;
}
