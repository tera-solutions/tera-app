import moment from "moment";

import type { CalendarCardEvent } from "_common/components/CalendarCard";
import type { MetaOption } from "_common/hooks/useMeta";

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

/** Map đơn xin nghỉ → sự kiện cho `CalendarCard` dùng chung, màu theo `leave_status`. */
export const toLeaveCalendarCardEvents = (
  items: LeaveRequestRow[],
  getItem: (name: string, value?: string | null) => MetaOption | undefined,
): CalendarCardEvent<LeaveRequestRow>[] =>
  items
    .filter((it) => it.leaveDate)
    .map((it) => {
      const meta = getItem("leave_status", it.status);
      return {
        id: it.id,
        date: moment(it.leaveDate).format("YYYY-MM-DD"),
        title: it.requesterName ?? it.reasonTypeLabel ?? "",
        color: meta?.color ?? "#374151",
        backgroundColor: meta?.backgroundColor ?? "#f3f4f6",
        item: it,
      };
    });

export const summarizeLeaveRequests = (items: LeaveRequestRow[]): LeaveSummary => ({
  total: items.length,
  pending: items.filter((i) => i.status === "pending").length,
  approved: items.filter((i) => i.status === "approved").length,
  rejected: items.filter((i) => i.status === "rejected").length,
});
