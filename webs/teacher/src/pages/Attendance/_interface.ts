import type { AttendanceStatus } from "pages/ClassroomDetail/_interface";

export interface AttendanceClassOption {
  id: number;
  name: string;
  category: string;
  level: string;
  room: string;
  branch: string;
  schedule_days: string;
  start_time: string;
  end_time: string;
  max_students: number;
  cover_image: string;
}

export interface AttendanceSession {
  id: number;
  session_no: number | null;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
}

/** One student row in the attendance grid — draft status is editable locally. */
export interface AttendanceRow {
  student_id: number;
  name: string;
  avatar: string;
  code: string;
  /** Attendance record id, if one already exists for this session. */
  record_id: number | null;
  status: AttendanceStatus;
  time: string;
  /** True once the user changes the status in this session (needs saving). */
  dirty: boolean;
}

export interface AttendanceSummaryCounts {
  present: number;
  late: number;
  absent: number;
  total: number;
}
