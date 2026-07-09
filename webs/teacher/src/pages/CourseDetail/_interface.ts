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
