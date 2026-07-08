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
  { key: "analysis", label: "Phân tích kết quả" },
];
