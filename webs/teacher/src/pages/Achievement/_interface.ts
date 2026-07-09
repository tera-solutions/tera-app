export interface TeacherProfile {
  full_name: string;
  avatar_url: string;
  role_name: string;
}

export interface CareerStats {
  total_classes: number;
  total_hours: number;
  total_students: number;
  rating_rate: number;
}

export interface AchievementOverview {
  avg_rating: number;
  satisfaction_rate: number;
  sessions_count: number;
  active_classes: number;
}

export type ChartPeriod = "week" | "month" | "year";

export interface ProgressPoint {
  label: string;
  rating: number | null;
  students: number;
  sessions: number;
}

export interface TeacherReview {
  id: number;
  student_name: string;
  student_avatar: string;
  rating: number;
  content: string;
  created_at: string;
}
