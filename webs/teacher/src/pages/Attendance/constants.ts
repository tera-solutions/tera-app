import type { AttendanceStatus } from "pages/ClassroomDetail/_interface";

export const STATUS_ACTIONS: { status: AttendanceStatus; label: string }[] = [
  { status: "present", label: "Đánh dấu có mặt" },
  { status: "late", label: "Đánh dấu đi muộn" },
  { status: "absent", label: "Đánh dấu vắng mặt" },
];

export const SESSION_RANGE_MONTHS = 3;
