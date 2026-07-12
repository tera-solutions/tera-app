export interface CourseResponse {
  id: number;
  name: string;
  code?: string;
  thumbnail?: string | null;
  description?: string | null;
  duration_minutes?: number | null;
  price_per_lesson?: number | string | null;
  is_active?: boolean;
  curriculums?: CurriculumRaw[];
}

export interface CurriculumRaw {
  id: number;
  order?: number;
  title?: string;
  content?: string;
}

export interface CourseStatsRaw {
  operational?: {
    total_classes?: number;
    active_classes?: number;
    total_students?: number;
    completed_students?: number;
  };
}

export interface CourseDetailInfo {
  id: number;
  name: string;
  code: string;
  thumbnail: string;
  description: string;
  durationMinutes: number;
  pricePerLesson: number;
  isActive: boolean;
}

export interface CourseStats {
  totalClasses: number;
  activeClasses: number;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
}

export interface CurriculumItem {
  id: number;
  order: number;
  title: string;
  content: string;
}
