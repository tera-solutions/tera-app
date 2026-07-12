export interface CourseResponse {
  id: number;
  name: string;
  code?: string;
  thumbnail?: string | null;
  description?: string | null;
  duration_minutes?: number | null;
  price_per_lesson?: number | string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CourseListItem {
  id: string;
  name: string;
  code: string;
  thumbnail: string;
  durationMinutes: number;
  pricePerLesson: number;
  isActive: boolean;
}
