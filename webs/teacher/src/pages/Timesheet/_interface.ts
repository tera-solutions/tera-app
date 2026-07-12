import type { ScheduleItem } from "_common/types/schedule";

export type { ScheduleItem };

export interface TimesheetStats {
  total: number;
  completed: number;
  upcoming: number;
  cancelled: number;
  totalMinutes: number;
}

export interface WeekBucket {
  label: string;
  /** Khoảng ngày của tuần (đã clamp trong range), vd "01 - 04/07". */
  dateLabel: string;
  minutes: number;
}

export interface DonutData {
  labels: string[];
  data: number[];
  colors: string[];
}
