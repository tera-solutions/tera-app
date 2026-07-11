export type AssignmentStatus = "draft" | "published" | "closed";

export interface Assignment {
  id: number;
  code: string;
  name: string;
  type: string;
  class_id: number | null;
  class_name: string;
  course_id: number | null;
  level_id: number | null;
  lesson_id: number | null;
  description: string;
  instruction: string;
  due_date: string;
  max_score: number;
  status: AssignmentStatus;
  student_count: number;
  avatar_url: string;
  allow_late_submission: boolean;
  allow_multiple_submission: boolean;
}

export interface AssignmentSummary {
  total: number;
  assigned: number;
  draft: number;
  pending_grading: number;
  due_this_week: number;
}

export interface AssignmentFormValues {
  assignment_name: string;
  assignment_type: string;
  avatar: string;
  description: string;
  instruction: string;
  due_date: string;
  max_score: number;
  course_id?: number;
  class_room_id?: number;
  level_id?: number;
  lesson_id?: number;
  allow_late_submission: boolean;
  allow_multiple_submission: boolean;
}
