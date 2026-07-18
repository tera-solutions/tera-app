import type { LeaveRequestRow, LeaveSummary, MakeupRow } from "./_interface";

const toMakeup = (raw: any): MakeupRow => ({
  id: raw.id,
  status: raw.status,
  originalLessonLabel: raw.original_lesson
    ? `Buổi ${raw.original_lesson.lesson_no} (${raw.original_lesson.lesson_date})`
    : null,
  makeupLessonLabel: raw.makeup_lesson
    ? `Buổi ${raw.makeup_lesson.lesson_no} (${raw.makeup_lesson.lesson_date})`
    : null,
});

/** ✅ Khớp `LeaveRequestResource` (`v1/edu/leave/*`). */
export const toLeaveRequest = (raw: any): LeaveRequestRow => ({
  id: raw.id,
  code: raw.request_code,
  requestType: raw.request_type,
  requesterId: raw.requester_id,
  requesterName: raw.requester_name ?? null,
  classRoomId: raw.class_room_id ?? null,
  lessonId: raw.lesson_id ?? null,
  lessonLabel: raw.lesson
    ? `Buổi ${raw.lesson.lesson_no} - ${raw.lesson.lesson_title ?? ""}`.trim()
    : null,
  leaveDate: raw.leave_date ?? null,
  reasonType: raw.reason_type,
  reasonTypeLabel: raw.reason_type_label ?? null,
  reason: raw.reason ?? null,
  status: raw.status,
  approvedAt: raw.approved_at ?? null,
  rejectionReason: raw.rejection_reason ?? null,
  makeups: (raw.makeups ?? []).map(toMakeup),
  createdAt: raw.created_at ?? null,
  createdBy: raw.created_by ?? null,
});

export const toLeaveRequests = (raw: any): LeaveRequestRow[] =>
  (raw?.data?.items ?? []).map(toLeaveRequest);

export const toLeaveRequestDetail = (raw: any): LeaveRequestRow | null =>
  raw?.data ? toLeaveRequest(raw.data) : null;

export const summarizeLeaveRequests = (items: LeaveRequestRow[]): LeaveSummary => ({
  total: items.length,
  pending: items.filter((i) => i.status === "pending").length,
  approved: items.filter((i) => i.status === "approved").length,
  rejected: items.filter((i) => i.status === "rejected").length,
});
