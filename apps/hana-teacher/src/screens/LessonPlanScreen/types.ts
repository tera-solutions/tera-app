// ── API response types (từ /v1/edu/lesson-plan/list) ───────────

export type LessonPlanStatus = 'draft' | 'reviewing' | 'published' | 'archived';

export interface LessonPlanResponse {
  id: number;
  plan_code?: string;
  plan_name: string;
  course_id?: number;
  level_id?: number | null;
  version?: number;
  total_lessons?: number;
  lessons_count?: number;
  description?: string | null;
  status?: LessonPlanStatus;
  published_at?: string | null;
  course?: { id: number; name: string; code?: string } | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface LessonPlanStats {
  total: number;
  published: number;
  reviewing: number;
  progressPercent: number;
}
