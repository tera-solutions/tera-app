export interface RoomDetailInfo {
  id: number;
  code: string;
  name: string;
  type: string;
  floor: string;
  capacity: number;
  status: string;
}

export interface ScheduleSlot {
  weekday: number;
  start_time: string;
  end_time: string;
}

export interface CurrentSession {
  session_id: number;
  class_id: number;
  class_code: string;
  class_name: string;
  course_id: number | null;
  level: string;
  teacher_name: string;
  session_date: string;
  start_time: string;
  end_time: string;
  class_start_date: string;
  class_end_date: string;
  student_count: number;
  max_students: number;
  schedules: ScheduleSlot[];
}

/** An active class assigned to the room, whether or not it's in session right now. */
export interface ClassInUse {
  id: number;
  code: string;
  name: string;
  teacher_id: number | null;
  teacher_name: string;
  student_count: number;
  max_students: number;
}

export type AttendanceStatus = "present" | "absent" | "late" | "excused" | "other";

export interface RoomStudent {
  id: number;
  name: string;
  avatar: string;
  status: AttendanceStatus;
}
