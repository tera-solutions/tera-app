import type { ExamSkill } from "./_interface";

export const EXAM_SESSION_STATUS_META = "exam_session_status";
export const EXAM_REGISTRATION_STATUS_META = "exam_registration_status";
export const EXAM_SKILL_META = "exam_skill";

export const SKILL_LABEL: Record<ExamSkill, string> = {
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
};

export type ExamTabKey = "results" | "questions" | "analysis" | "detail";

export const EXAM_TABS: { key: ExamTabKey; label: string }[] = [
  { key: "results", label: "Kết quả học viên" },
  { key: "questions", label: "Thống kê câu hỏi" },
  { key: "analysis", label: "Phân tích kết quả" },
  { key: "detail", label: "Chi tiết bài làm" },
];

export const GRADE_LABEL: Record<string, { label: string; color: string }> = {
  excellent: { label: "Xuất sắc", color: "#10b981" },
  good: { label: "Giỏi", color: "#38bdf8" },
  pass: { label: "Đạt", color: "#f59e0b" },
  fail: { label: "Chưa đạt", color: "#ef4444" },
};
