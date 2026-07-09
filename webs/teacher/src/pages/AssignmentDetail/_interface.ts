import type { AssignmentStatus } from "pages/Assignment/_interface";

export interface AssignmentDetailData {
  id: number;
  code: string;
  name: string;
  type: string;
  instruction: string;
  class_name: string;
  due_date: string;
  max_score: number;
  status: AssignmentStatus;
  progress: {
    total: number;
    submitted: number;
    graded: number;
    pending: number;
  };
}

export interface AssignmentAttachment {
  id: number;
  name: string;
  type: string;
  file_id: number | null;
  file_name: string;
}
