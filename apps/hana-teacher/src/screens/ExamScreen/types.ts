export type ExamFilterTab = 'all' | 'ongoing' | 'ended' | 'upcoming';

export type ExamStatus = 'ongoing' | 'needs_grading' | 'completed' | 'upcoming';

export interface ExamItem {
  id: string;
  title: string;
  className: string;
  date: string;
  duration: number; // minutes
  studentCount: number;
  status: ExamStatus;
  needsGradingCount?: number;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

export interface ExamStats {
  total: number;
  completed: number;
  ongoing: number;
  upcoming: number;
}

export interface GradeRange {
  label: string;
  range: string;
  percent: number;
  count: number;
  color: string;
}

export interface GradeReport {
  avgPercent: number;
  grades: GradeRange[];
}

// ── API response types (từ /v1/education/exam/list) ────────────

export type ExamApiStatus = 'draft' | 'published' | 'active' | 'completed' | 'archived';

export type ExamType = 'quiz' | 'midterm' | 'final' | 'practice' | 'other';

export interface ExamResponse {
  id: number;
  exam_code?: string;
  exam_name: string;
  exam_type?: ExamType;
  course_id?: number;
  course?: { id: number; code?: string; name: string } | null;
  level_id?: number | null;
  level?: { id: number; level_code?: string; level_name?: string } | null;
  duration?: number;          // phút
  total_score?: string;       // "100.00"
  passing_score?: string;     // "70.00"
  version?: number;
  status?: ExamApiStatus;
  questions?: unknown[];
  published_at?: string | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
