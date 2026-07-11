import type { RankingTab } from "./_interface";

export const RANKING_TABS: { key: RankingTab; label: string }[] = [
  { key: "overall", label: "Bảng tổng hợp" },
  { key: "progress", label: "Tiến lớp" },
  { key: "group", label: "Chọn nhóm" },
  { key: "evaluation", label: "Đánh giá" },
];

export const MEDAL_COLOR = ["#facc15", "#94a3b8", "#d97706"];
