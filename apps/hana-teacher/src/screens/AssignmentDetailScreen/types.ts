import type { AssignmentApiStatus, AssignmentType } from '@screens/AssignmentScreen/types';

export interface AssignmentDetailData {
  id: number;
  code: string;
  name: string;
  type: AssignmentType;
  instruction: string;
  className: string;
  dueDate: string;
  maxScore: number;
  status: AssignmentApiStatus;
  progress: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
  };
}

export interface AttachmentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  date: string;
}

export type SubmissionStatus = 'assigned' | 'submitted' | 'late_submitted' | 'graded' | 'reviewed';

export interface SubmissionRow {
  id: number;
  studentId: number;
  studentName: string;
  status: SubmissionStatus;
  score: number | null;
}
