import type { QuestionDifficulty, QuestionSkill, QuestionType } from "./_interface";

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  single_choice: "Một đáp án",
  multiple_choice: "Nhiều đáp án",
  true_false: "Đúng/Sai",
  matching: "Nối",
  ordering: "Sắp xếp",
  fill_blank: "Điền khuyết",
  short_answer: "Trả lời ngắn",
  essay: "Tự luận",
  speaking: "Nói",
  listening: "Nghe",
};

export const QUESTION_TYPE_OPTIONS = [
  { value: "", label: "Tất cả dạng câu hỏi" },
  ...Object.entries(QUESTION_TYPE_LABELS).map(([value, label]) => ({ value, label })),
];

export const QUESTION_SKILL_LABELS: Record<QuestionSkill, string> = {
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
};

export const QUESTION_SKILL_OPTIONS = [
  { value: "", label: "Tất cả môn học" },
  ...Object.entries(QUESTION_SKILL_LABELS).map(([value, label]) => ({ value, label })),
];

export const QUESTION_DIFFICULTY_LABELS: Record<QuestionDifficulty, string> = {
  easy: "Dễ",
  medium: "Trung bình",
  hard: "Khó",
};

export const QUESTION_DIFFICULTY_COLORS: Record<QuestionDifficulty, string> = {
  easy: "#10b981",
  medium: "#f59e0b",
  hard: "#ef4444",
};

export const QUESTION_DIFFICULTY_BADGE: Record<QuestionDifficulty, string> = {
  easy: "bg-emerald-50 text-emerald-600",
  medium: "bg-amber-50 text-amber-600",
  hard: "bg-red-50 text-red-600",
};

export const QUESTION_DIFFICULTY_OPTIONS = [
  { value: "", label: "Tất cả độ khó" },
  ...Object.entries(QUESTION_DIFFICULTY_LABELS).map(([value, label]) => ({ value, label })),
];

export const QUESTION_TAB_OPTIONS = [
  { key: "all", label: "Tất cả câu hỏi" },
  { key: "mine", label: "Câu hỏi của tôi" },
];

export const DEFAULT_ANSWER_OPTIONS = [
  { answer_key: "A", answer_content: "", is_correct: false },
  { answer_key: "B", answer_content: "", is_correct: false },
  { answer_key: "C", answer_content: "", is_correct: false },
  { answer_key: "D", answer_content: "", is_correct: false },
];
