/** Lifecycle of a class session, shared across the Schedule and Dashboard pages. */
export type ScheduleStatus = "upcoming" | "ongoing" | "done" | "cancelled";

/** A single class session, as consumed by both the Schedule and Dashboard pages. */
export interface ScheduleItem {
  id: number;
  class_id: number;
  class_name: string;
  level: string;
  room: string;
  branch: string; // cơ sở
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
