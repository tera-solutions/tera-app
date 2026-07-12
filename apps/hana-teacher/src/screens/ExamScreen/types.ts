export type ExamFilterTab = 'all' | 'ongoing' | 'ended' | 'upcoming';

export type ExamStatus = 'scheduled' | 'in_progress' | 'closed';

export interface ExamItem {
  id: string;
  sessionId: number;
  title: string;
  className: string;
  date: string;
  timeRange: string;
  studentCount: number;
  status: ExamStatus;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

export interface ExamStats {
  total: number;
  scheduled: number;
  in_progress: number;
  closed: number;
}

// ── API response types (từ /v1/edu/exam-session/list) ───────────

export interface ExamSessionResponse {
  id: number;
  exam?: { id: number; exam_name?: string; exam_type?: string } | null;
  exam_id?: number | null;
  class?: { id: number; name?: string } | null;
  class_room_id?: number | null;
  exam_date?: string | null;
  start_time?: string | null;
  end_time?: string | null;
  status?: ExamStatus;
  registrations_count?: number;
}
