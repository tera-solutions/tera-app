export type SubmissionStatus = "assigned" | "submitted" | "late_submitted" | "graded" | "reviewed";

export interface SubmissionRow {
  id: number;
  student_id: number;
  student_name: string;
  student_avatar: string;
  status: SubmissionStatus;
  submitted_at: string | null;
  score: number | null;
}

export interface SubmissionFile {
  url: string;
  type: string;
  name?: string;
}

export interface SubmissionDetail {
  id: number;
  student_id: number;
  answer: string;
  files: SubmissionFile[];
  submitted_at: string | null;
  score: number | null;
  comment: string;
  status: SubmissionStatus;
  resultPublished: boolean;
}

export interface GradeFormValues {
  score: number;
  comment: string;
}

export interface AssignmentHeader {
  id: number;
  name: string;
  class_name: string;
  max_score: number;
  progress: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
  };
}
