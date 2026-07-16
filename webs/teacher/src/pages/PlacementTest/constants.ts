export const CEFR_LEVEL_OPTIONS = [
  { value: "Pre-A1", label: "Pre-A1" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
];

export const SKILL_OPTIONS = [
  { value: "listening", label: "Nghe" },
  { value: "speaking", label: "Nói" },
  { value: "reading", label: "Đọc" },
  { value: "writing", label: "Viết" },
  { value: "grammar", label: "Ngữ pháp" },
  { value: "vocabulary", label: "Từ vựng" },
];

export const SKILL_LABELS: Record<string, string> = {
  listening: "Nghe",
  speaking: "Nói",
  reading: "Đọc",
  writing: "Viết",
  grammar: "Ngữ pháp",
  vocabulary: "Từ vựng",
};

export const PLACEMENT_TEST_STATUS_LABELS: Record<string, string> = {
  draft: "Bản nháp",
  published: "Đã xuất bản",
};

export const PLACEMENT_TEST_STATUS_BADGE: Record<string, string> = {
  draft: "bg-slate-100 text-slate-500",
  published: "bg-emerald-50 text-emerald-600",
};

export const PLACEMENT_TEST_TABS = [
  { key: "tests", label: "Danh sách bài kiểm tra" },
  { key: "questions", label: "Ngân hàng câu hỏi" },
  { key: "results", label: "Kết quả học viên" },
];
