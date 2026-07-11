export type ExamSessionStatus = "scheduled" | "in_progress" | "closed";
export type RegistrationStatus =
  | "registered"
  | "in_progress"
  | "submitted"
  | "absent"
  | "graded"
  | "published";

export const EXAM_SKILLS = [
  "listening",
  "speaking",
  "reading",
  "writing",
  "grammar",
  "vocabulary",
] as const;
export type ExamSkill = (typeof EXAM_SKILLS)[number];

export interface ExamSessionHeader {
  id: number;
  exam_id: number | null;
  exam_name: string;
  class_name: string;
  room_name: string;
  teacher_name: string;
  exam_date: string;
  status: ExamSessionStatus;
}

export interface ExamSessionRow {
  id: number;
  exam_id: number | null;
  exam_name: string;
  exam_type: string;
  class_id: number | null;
  class_name: string;
  room_name: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  status: ExamSessionStatus;
  registrations_count: number;
}

export interface ExamSessionSummary {
  total: number;
  scheduled: number;
  in_progress: number;
  closed: number;
}

export type ExamResultGrade = "excellent" | "good" | "pass" | "fail";

export interface ExamResultRow {
  registration_id: number;
  student_id: number;
  student_code: string;
  student_name: string;
  student_avatar: string;
  registration_status: RegistrationStatus;
  scores: Partial<Record<ExamSkill, number>>;
  total_score: number | null;
  passed: boolean | null;
  grade: ExamResultGrade | null;
}

export interface ExamGradeFormValues {
  listening_score?: number;
  speaking_score?: number;
  reading_score?: number;
  writing_score?: number;
  grammar_score?: number;
  vocabulary_score?: number;
}
