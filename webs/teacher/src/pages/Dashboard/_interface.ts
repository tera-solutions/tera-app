import type { ScheduleItem } from "_common/types/schedule";

export interface DashboardStats {
  students_enrolled: number;
  active_classes: number;
  lessons_today: number;
  completion_rate: number;
}

export interface DashboardWeekDay {
  date: string;
  count: number;
}

export interface DashboardAttendance {
  present: number;
  absent: number;
  late: number;
  total: number;
}

export interface DashboardSummary {
  stats: DashboardStats;
  schedule_today: ScheduleItem[];
  schedule_week: DashboardWeekDay[];
  homework_pending: DashboardHomeworkItem[];
  lesson_plans: DashboardLessonPlanItem[];
  my_classes: DashboardClassItem[];
  attendance: DashboardAttendance | null;
}

export interface DashboardHomeworkItem {
  id: number;
  title: string;
  class_name: string;
  pending_count: number;
  deadline: string;
}

export interface DashboardLessonPlanItem {
  id: number;
  unit_name: string;
  class_name: string;
  taught_percent: number;
}

export interface DashboardClassItem {
  id: number;
  name: string;
  level: string;
  student_count: number;
}

export interface DashboardNotificationItem {
  id: number;
  title: string;
  content: string;
  type: string;
  is_read: boolean;
  created_at: string;
}
