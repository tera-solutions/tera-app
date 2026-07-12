/** Real `edu_evaluations` criteria keys allowed for `evaluation_type=student`. */
export type EvaluationCriterion =
  | 'knowledge'
  | 'pronunciation'
  | 'vocabulary'
  | 'grammar'
  | 'communication'
  | 'diligence'
  | 'interaction'
  | 'discipline'
  | 'homework';

export interface EvaluationCreateForm {
  criteria: Record<EvaluationCriterion, number>;
  comment: string;
  evaluation_period: string;
}
