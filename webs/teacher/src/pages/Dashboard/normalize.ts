import { pick } from "_common/utils/pick";

import type {
  DashboardClassItem,
  DashboardHomeworkItem,
  DashboardLessonPlanItem,
  DashboardNotificationItem,
} from "./_interface";

export const normalizeHomework = (raw: any): DashboardHomeworkItem => ({
  id: Number(pick(raw, ["id", "assignment_id"]) ?? 0),
  title:
    pick(raw, ["title", "name", "assignment_name", "assignment_title"]) ?? "",
  class_name:
    pick(raw, [
      "class_room.name",
      "class_name",
      "class.name",
      "classroom.name",
    ]) ?? "",
  pending_count: Number(
    pick(raw, [
      "pending_count",
      "ungraded_count",
      "submissions_pending",
      "pending_submissions",
      "pending",
    ]) ?? 0,
  ),
  deadline: pick(raw, ["deadline", "due_date", "end_date", "due_at"]) ?? "",
});

export const normalizeLessonPlan = (raw: any): DashboardLessonPlanItem => ({
  id: Number(pick(raw, ["id", "plan_id"]) ?? 0),
  unit_name: pick(raw, ["plan_name", "name", "unit_name", "plan_code"]) ?? "",
  class_name:
    pick(raw, ["course.name", "class_name", "course_name"]) ??
    (raw?.total_lessons != null ? `${raw.total_lessons} bài học` : ""),
  taught_percent: Number(
    pick(raw, ["taught_percent", "progress", "completion_rate"]) ?? 0,
  ),
});

export const normalizeClass = (raw: any): DashboardClassItem => ({
  id: Number(pick(raw, ["id", "class_room_id"]) ?? 0),
  name: pick(raw, ["name", "class_name", "code"]) ?? "",
  level:
    pick(raw, ["level.name", "level_name", "course.name", "course_name"]) ?? "",
  student_count: Number(
    pick(raw, [
      "student_count",
      "students_count",
      "enrolled_count",
      "current_capacity",
      "total_students",
    ]) ?? 0,
  ),
});

export const normalizeNotification = (raw: any): DashboardNotificationItem => ({
  id: Number(pick(raw, ["id"]) ?? 0),
  title: pick(raw, ["title", "subject", "name"]) ?? "",
  content: pick(raw, ["content", "message", "body"]) ?? "",
  type: pick(raw, ["type", "category"]) ?? "",
  is_read: Boolean(pick(raw, ["is_read", "is_view", "read"])),
  created_at: pick(raw, ["created_at", "created", "createdAt"]) ?? "",
});
