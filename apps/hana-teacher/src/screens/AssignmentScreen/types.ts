export type AssignmentApiStatus = 'draft' | 'published' | 'closed';

export type AssignmentType =
  | 'homework'
  | 'worksheet'
  | 'quiz'
  | 'writing'
  | 'speaking'
  | 'listening'
  | 'reading'
  | 'project'
  | 'exam_practice';

export interface AssignmentCourse {
  id: number;
  code: string;
  name: string;
}

export interface AssignmentClass {
  id: number;
  code: string;
  name: string;
}

export interface AssignmentResponse {
  id: number;
  assignment_code: string;
  assignment_name: string;
  assignment_type: AssignmentType;
  course_id?: number;
  course?: AssignmentCourse | null;
  level_id?: number | null;
  lesson_id?: number | null;
  class_room_id?: number;
  class?: AssignmentClass | null;
  description?: string | null;
  instruction?: string;
  max_score?: string;
  due_date?: string;
  allow_late_submission?: boolean;
  allow_multiple_submission?: boolean;
  status?: AssignmentApiStatus;
  submissions_count?: number;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AssignmentStats {
  total: number;
  published: number;
  draft: number;
  closed: number;
}
