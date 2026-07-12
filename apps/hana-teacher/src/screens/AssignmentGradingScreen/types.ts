export type SubmissionStatus = 'assigned' | 'submitted' | 'late_submitted' | 'graded' | 'reviewed';

export interface AssignmentGradingHeader {
  id: number;
  name: string;
  className: string;
  maxScore: number;
  progress: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
  };
}

export interface SubmissionRow {
  id: number;
  studentId: number;
  studentName: string;
  studentAvatar: string;
  status: SubmissionStatus;
  submittedAt: string | null;
  score: number | null;
}

export interface SubmissionFile {
  url: string;
  type: string;
  name?: string;
}

export interface SubmissionDetailData {
  id: number;
  studentId: number;
  answer: string;
  files: SubmissionFile[];
  submittedAt: string | null;
  score: number | null;
  comment: string;
  status: SubmissionStatus;
}

export interface GradeFormValues {
  score: number;
  comment: string;
}
