export type ExamBankStatus = "draft" | "published" | "archived";

export interface ExamBank {
  id: number;
  code: string;
  name: string;
  type: string;
  course_name: string;
  level_name: string;
  duration: number;
  total_score: number;
  passing_score: number;
  status: ExamBankStatus;
  questions_count: number;
  course_id: number | null;
  level_id: number | null;
}

export interface ExamSessionSummary {
  id: number;
  exam_date: string;
  status: string;
  class_name: string;
  total_students: number;
  submitted: number;
  avg_score: number;
}

export interface SiblingExam {
  id: number;
  name: string;
  type: string;
  active: boolean;
}

export interface ExamFormValues {
  exam_name: string;
  exam_type: string;
  course_id?: number;
  level_id?: number;
  duration: number;
  total_score: number;
  passing_score: number;
}
