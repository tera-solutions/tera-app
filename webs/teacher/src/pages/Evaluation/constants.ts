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
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
};

export const CRITERION_KEYS = Object.keys(CRITERION_LABEL) as EvaluationCriterion[];

/** Vietnamese labels for `teacher`/`parent` evaluation criteria (EvaluationType::criteria()). */
export const TEACHER_CRITERION_LABEL: Record<string, string> = {
  expertise: "Chuyên môn",
  teaching_method: "Phương pháp giảng dạy",
  communication: "Giao tiếp",
  interaction: "Tương tác",
  attitude: "Thái độ",
  punctuality: "Đúng giờ",
};

export const PARENT_CRITERION_LABEL: Record<string, string> = {
  cooperation: "Phối hợp",
  learning_follow_up: "Theo sát học tập",
  on_time_payment: "Đóng học phí đúng hạn",
  meeting_attendance: "Tham dự họp phụ huynh",
  feedback: "Phản hồi",
};

/** Allowed criterion keys + VN labels per `evaluation_type`, mirroring EvaluationType::criteria() —
 * the single source of truth EvaluationCriteriaTemplate options must stay within. */
export const EVALUATION_CRITERIA_BY_TYPE: Record<string, Record<string, string>> = {
  teacher: TEACHER_CRITERION_LABEL,
  student: CRITERION_LABEL,
  parent: PARENT_CRITERION_LABEL,
};

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
