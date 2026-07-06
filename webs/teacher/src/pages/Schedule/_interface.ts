import type { ScheduleStatus } from "_common/types/schedule";

export type { ScheduleStatus, ScheduleItem } from "_common/types/schedule";

export type ScheduleView = "week" | "month" | "day" | "list" | "range";

export interface CalendarParams {
  date_from: string;
  date_to: string;
  class_id?: number;
  teacher_id?: number;
  branch_id?: number;
  status?: string;
}

export interface ScheduleSummary {
  total_classes: number;
  total_students: number;
  lessons_this_week: number;
}

export interface ScheduleDetail {
  id: number;
  class_id?: number;
  class_name: string;
  level: string;
  room: string;
  branch: string;
  date: string;
  start_time: string;
  end_time: string;
  status: ScheduleStatus;
  lesson_plan: {
    id: number;
    title: string;
  } | null;
  student_count: number;
  attendance_done: boolean;
}
