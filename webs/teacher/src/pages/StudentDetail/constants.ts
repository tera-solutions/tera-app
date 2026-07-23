import type { DetailTab } from "./_interface";

export const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "overview", label: "Tổng quan" },
  { key: "scores", label: "Điểm số" },
  { key: "attendance", label: "Điểm danh" },
  { key: "assignment", label: "Bài tập" },
  { key: "exam", label: "Bài kiểm tra" },
  { key: "history", label: "Lịch sử học tập" },
  { key: "level-history", label: "Lịch sử trình độ" },
  { key: "certificates", label: "Chứng chỉ" },
];

/** Tabs backed by a real teacher endpoint; the rest render a "coming soon" state. */
export const SUPPORTED_TABS: DetailTab[] = [
  "overview",
  "attendance",
  "scores",
  "assignment",
  "exam",
  "history",
  "level-history",
  "certificates",
];
