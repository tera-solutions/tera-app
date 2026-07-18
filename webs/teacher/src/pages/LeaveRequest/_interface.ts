/**
 * [068] Đơn xin nghỉ — khớp `v1/edu/leave/*` (LeaveRequestResource, BE 2026-07-17).
 * Đơn gắn với MỘT buổi học cụ thể (không phải quỹ phép năm): học viên xin nghỉ 1
 * buổi (raise học bù) hoặc giáo viên xin nghỉ dạy 1 buổi.
 */

export type LeaveRequestType = "student_leave" | "teacher_leave";

export type LeaveReasonType = "sick" | "family" | "school_activity" | "vacation" | "personal" | "other";

export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled" | "completed";

export type MakeupStatus = "waiting" | "scheduled" | "completed" | "expired";

export interface MakeupRow {
  id: number;
  status: MakeupStatus;
  originalLessonLabel: string | null;
  makeupLessonLabel: string | null;
}

export interface LeaveRequestRow {
  id: number;
  code: string;
  requestType: LeaveRequestType;
  requesterId: number;
  requesterName: string | null;
  classRoomId: number | null;
  lessonId: number | null;
  lessonLabel: string | null;
  leaveDate: string | null;
  reasonType: LeaveReasonType;
  reasonTypeLabel: string | null;
  reason: string | null;
  status: LeaveStatus;
  approvedAt: string | null;
  rejectionReason: string | null;
  makeups: MakeupRow[];
  createdAt: string | null;
  createdBy: number | null;
}

export interface LeaveSummary {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

/** Body form tạo đơn. */
export interface CreateLeaveFormValues {
  request_type: LeaveRequestType;
  requester_id: number | string | undefined;
  lesson_id: number | string | undefined;
  leave_date: string;
  reason_type: LeaveReasonType | "";
  reason?: string;
}
