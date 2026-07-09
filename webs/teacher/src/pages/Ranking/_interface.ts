export interface RankingSummary {
  total_students: number;
  avg_score: number;
  total_classes: number;
  good_rate: number;
}

export interface RankingRow {
  student_id: number;
  student_name: string;
  student_avatar: string;
  class_name: string;
  score: number | null;
  classification_label: string | null;
  history: number[];
  prev_month_score: number | null;
  curr_month_score: number | null;
}

export type RankingTab = "overall" | "progress" | "group" | "evaluation";
