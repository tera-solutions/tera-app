/**
 * Lifecycle of a class session, shared across the Schedule and Dashboard pages.
 * Raw backend value from the `class_session_status` metadata list — label and
 * color are resolved from metadata, not hardcoded here.
 */
export type ScheduleStatus = string;

/** A single class session, as consumed by both the Schedule and Dashboard pages. */
export interface ScheduleItem {
  id: number;
  class_id: number;
  class_name: string;
  level: string;
  room: string;
  branch: string; // cơ sở
  branch_id: number | null;
  date: string; // "YYYY-MM-DD"
  start_time: string; // "HH:mm"
  end_time: string; // "HH:mm"
  status: ScheduleStatus;
  lesson_plan_id: number | null;
  student_count: number;
  teacher_name: string;
  session_no: number | null;
  session_name: string;
}
