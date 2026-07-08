export type AssignmentStatus = "draft" | "published" | "closed";

export interface Homework {
  id: number;
  code: string;
  name: string;
  type: string;
  class_id: number | null;
  class_name: string;
  course_id: number | null;
  level_id: number | null;
  due_date: string;
  max_score: number;
  status: AssignmentStatus;
  student_count: number;
  avatar_url: string;
}

export interface HomeworkSummary {
  total: number;
  assigned: number;
  draft: number;
  pending_grading: number;
  due_this_week: number;
}

export interface HomeworkFormValues {
  assignment_name: string;
  assignment_type: string;
  instruction: string;
  due_date: string;
  max_score: number;
  class_room_id?: number;
  level_id?: number;
}
