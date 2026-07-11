export interface EvaluationSummary {
  total_students: number;
  evaluated_rate: number;
  total_comments: number;
  avg_rating: number | null;
  satisfaction_rate: number;
}

export interface StudentEvaluationRow {
  student_id: number;
  student_code: string;
  student_name: string;
  class_room_id: number | null;
  class_name: string;
  status: string;
  avatar: string;
  avg_score: number | null;
  latest_comment: string;
  updated_at: string;
  classification_label: string | null;
}

/** Real `edu_evaluations` criteria keys allowed for `evaluation_type=student` (see EvaluationType::criteria()). */
export type EvaluationCriterion =
  | "knowledge"
  | "pronunciation"
  | "vocabulary"
  | "grammar"
  | "communication"
  | "diligence"
  | "interaction"
  | "discipline"
  | "homework";

export interface EvaluationFormValues {
  criteria: Record<EvaluationCriterion, number>;
  comment: string;
  evaluation_period: string;
}
