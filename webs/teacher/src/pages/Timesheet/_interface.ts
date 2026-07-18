/** [053] Bảng công — khớp `v1/hr/timesheet/*` (TimesheetSessionResource, BE 2026-07-17).
 * Chỉ gồm buổi đã điểm danh (= "công" theo quyết định 2026-07-17), không phải mọi buổi
 * trong lịch — không còn khái niệm "sắp diễn ra"/"đã hủy" ở đây. */

export interface TimesheetSessionRow {
  id: number;
  code: string;
  sessionDate: string | null;
  startTime: string | null;
  endTime: string | null;
  hours: number;
  status: string;
  classId: number | null;
  className: string | null;
  /** scheduled | self_learning | flexible — `ClassLearningType` (BE). */
  learningType: string | null;
  roomName: string | null;
  presentCount: number;
  absentCount: number;
  attendancesCount: number;
  averageRating: number | null;
}

export interface TimesheetSummary {
  totalSessions: number;
  totalHours: number;
  hoursByType: Record<string, number>;
  attendanceRate: number | null;
  averageRating: number | null;
}

export interface WeekBucket {
  label: string;
  /** Khoảng ngày của tuần (đã clamp trong range), vd "01 - 04/07". */
  dateLabel: string;
  hours: number;
}
