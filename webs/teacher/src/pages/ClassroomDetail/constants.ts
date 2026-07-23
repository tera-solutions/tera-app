import type { DetailTab } from "./_interface";

export const DETAIL_TABS: { key: DetailTab; label: string }[] = [
  { key: "students", label: "Danh sách học viên" },
  { key: "attendance", label: "Điểm danh" },
  { key: "schedule", label: "Lịch học" },
  { key: "assignment", label: "Bài tập" },
  { key: "scores", label: "Điểm số" },
  { key: "certificates", label: "Chứng chỉ" },
  { key: "comments", label: "Nhận xét" },
  { key: "documents", label: "Tài liệu" },
];

/** Tabs backed by a real teacher endpoint; the rest render a "coming soon" state. */
export const SUPPORTED_TABS: DetailTab[] = [
  "students",
  "attendance",
  "schedule",
  "documents",
  "assignment",
  "scores",
  "certificates",
  "comments",
];

/** `schedules[].weekday`: 1=Thứ 2 … 6=Thứ 7, 7=CN (khớp backend, xem
 * `CreateScheduleRequest`/`RoomDetail/constants.ts`). */
export const WEEKDAY_LABEL: Record<number, string> = {
  1: "Thứ 2",
  2: "Thứ 3",
  3: "Thứ 4",
  4: "Thứ 5",
  5: "Thứ 6",
  6: "Thứ 7",
  7: "Chủ nhật",
};
