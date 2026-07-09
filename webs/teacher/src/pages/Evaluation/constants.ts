import type { EvaluationCriterion } from "./_interface";

/** Vietnamese labels for the real `student` evaluation criteria (EvaluationType::criteria()). */
export const CRITERION_LABEL: Record<EvaluationCriterion, string> = {
  knowledge: "Kiến thức",
  pronunciation: "Phát âm",
  vocabulary: "Từ vựng",
  grammar: "Ngữ pháp",
  communication: "Giao tiếp",
  diligence: "Chuyên cần",
  interaction: "Tương tác",
  discipline: "Kỷ luật",
  homework: "Bài tập",
};

export const CRITERION_KEYS = Object.keys(CRITERION_LABEL) as EvaluationCriterion[];

export const DEFAULT_CRITERIA_SCORE = 3;

export const EVALUATION_PERIOD_OPTIONS = [
  { value: "session", label: "Sau buổi học" },
  { value: "lesson", label: "Sau bài học" },
  { value: "midterm", label: "Giữa khóa" },
  { value: "final", label: "Cuối khóa" },
  { value: "course", label: "Kết thúc khóa" },
  { value: "monthly", label: "Hàng tháng" },
  { value: "quarterly", label: "Hàng quý" },
];
