export interface IEvaluationCriterion {
  criterion: string;
  score: number;
}

export interface IEvaluation {
  id: number;
  evaluation_code: string;
  evaluation_type: string;
  evaluation_type_label?: string;
  target_id?: number;
  evaluator_type?: string;
  evaluator_type_label?: string;
  evaluator_id?: number;
  course_id?: number;
  course?: { id: number; name: string } | null;
  class_room_id?: number | null;
  class_room?: { id: number; name: string } | null;
  lesson_id?: number | null;
  lesson?: { id: number; lesson_no: number; lesson_title: string } | null;
  evaluation_period?: string;
  evaluation_period_label?: string;
  criteria?: IEvaluationCriterion[];
  score?: string | number;
  classification?: string;
  classification_label?: string;
  comment?: string | null;
  strengths?: string | null;
  weaknesses?: string | null;
  recommendations?: string | null;
  status: string;
  status_label?: string;
  evaluated_at?: string;
  created_at?: string;
  updated_at?: string;
}

/** Xếp loại → màu badge (API trả sẵn classification_label). */
export const CLASSIFICATION_COLOR: Record<
  string,
  { color: string; backgroundColor: string }
> = {
  excellent: { color: "#16a34a", backgroundColor: "#dcfce7" },
  good: { color: "#0891b2", backgroundColor: "#cffafe" },
  average: { color: "#d97706", backgroundColor: "#fef3c7" },
  weak: { color: "#ea580c", backgroundColor: "#ffedd5" },
  warning: { color: "#dc2626", backgroundColor: "#fee2e2" },
};

/** Trạng thái đánh giá → màu badge (draft→submitted→approved/rejected→locked). */
export const STATUS_COLOR: Record<
  string,
  { color: string; backgroundColor: string }
> = {
  draft: { color: "#6b7280", backgroundColor: "#f3f4f6" },
  submitted: { color: "#2563eb", backgroundColor: "#dbeafe" },
  approved: { color: "#16a34a", backgroundColor: "#dcfce7" },
  rejected: { color: "#dc2626", backgroundColor: "#fee2e2" },
  locked: { color: "#475569", backgroundColor: "#e2e8f0" },
};

/** Danh sách trạng thái cho tab lọc (value + i18n key nhãn). */
export const STATUS_TABS = [
  "draft",
  "submitted",
  "approved",
  "rejected",
  "locked",
];

/** Loại đánh giá (đối tượng) cho bộ lọc. */
export const EVALUATION_TYPES = ["teacher", "student", "parent"];

/** Xếp loại cho bộ lọc. */
export const CLASSIFICATIONS = [
  "excellent",
  "good",
  "average",
  "weak",
  "warning",
];
