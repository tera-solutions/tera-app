export interface ScheduleSessionResponse {
  id: number;
  class_id?: number;
  class?: {
    id?: number;
    name?: string;
    course?: { name?: string } | null;
    branch?: { id?: number; name?: string } | null;
  } | null;
  room?: { name?: string } | null;
  session_date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  lesson_plan_id?: number | null;
  student_count?: number;
  teacher_name?: string;
  session_no?: number | null;
  name?: string;
}

export interface ScheduleSession {
  id: number;
  classId: number;
  className: string;
  level: string;
  room: string;
  branch: string;
  date: string; // "YYYY-MM-DD"
  startTime: string; // "HH:mm"
  endTime: string; // "HH:mm"
  status: string;
  studentCount: number;
  sessionNo: number | null;
  sessionName: string;
}

export interface WeekDay {
  label: string;
  number: string;
  fullDate: string; // "YYYY-MM-DD"
  isToday: boolean;
}

export interface ScheduleDayStats {
  sessionsCount: number;
  classesCount: number;
  totalHoursLabel: string;
  doneCount: number;
}
