export type QuestionType =
  | "single_choice"
  | "multiple_choice"
  | "true_false"
  | "matching"
  | "ordering"
  | "fill_blank"
  | "short_answer"
  | "essay"
  | "speaking"
  | "listening";

export type QuestionSkill = "listening" | "speaking" | "reading" | "writing" | "grammar" | "vocabulary";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface QuestionAnswerRow {
  answer_key: string;
  answer_content: string;
  is_correct: boolean;
}

export interface QuestionRow {
  id: number;
  code: string;
  content: string;
  type: QuestionType;
  skill: QuestionSkill;
  difficulty: QuestionDifficulty;
  categoryName: string | null;
  score: number;
  answersCount: number;
  status: string;
  createdBy: number | null;
  createdAt: string | null;
}

export interface QuestionSummary {
  total: number;
  mine: number;
  byDifficulty: Record<QuestionDifficulty, number>;
}

export type QuestionSortBy = "created_at" | "difficulty" | "skill";
export type QuestionSortDir = "asc" | "desc";
