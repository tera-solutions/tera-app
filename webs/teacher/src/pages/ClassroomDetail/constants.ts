import type { DetailTab } from "./_interface";

export const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "students", label: "Danh sách học viên" },
  { key: "attendance", label: "Điểm danh" },
  { key: "schedule", label: "Lịch học" },
  { key: "homework", label: "Bài tập" },
  { key: "scores", label: "Điểm số" },
  { key: "comments", label: "Nhận xét" },
  { key: "documents", label: "Tài liệu" },
  { key: "history", label: "Lịch sử lớp học" },
];

/** Tabs backed by a real teacher endpoint; the rest render a "coming soon" state. */
export const SUPPORTED_TABS: DetailTab[] = ["students", "attendance", "schedule", "documents"];

export const WEEKDAY_LABEL: Record<number, string> = {
  1: "Chủ nhật",
  2: "Thứ 2",
  3: "Thứ 3",
  4: "Thứ 4",
  5: "Thứ 5",
  6: "Thứ 6",
  7: "Thứ 7",
};
