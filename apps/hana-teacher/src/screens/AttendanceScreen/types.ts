// ─── API types ──────────────────────────────────────────────────────────────

export type AttendanceApiStatus = 'present' | 'late' | 'absent' | 'excused';

export interface AttendanceSessionInfo {
  id: number;
  session_no: number;
  name: string;
  session_date: string;
  status: string;
}

export interface AttendanceStudentInfo {
  id: number;
  code: string;
  name: string;
}

export interface AttendanceResponse {
  id: number;
  session_id: number;
  session?: AttendanceSessionInfo | null;
  student_id: number;
  student?: AttendanceStudentInfo | null;
  status: AttendanceApiStatus;
  status_label?: string;
  checkin_time?: string | null;
  checkout_time?: string | null;
  note?: string | null;
}

export interface ClassSessionResponse {
  id: number;
  session_no?: number | null;
  name?: string;
  session_date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
}

export interface RosterStudentResponse {
  id: number;
  code?: string;
  name: string;
  avatar?: string | null;
}

export interface ClassRoomDetailResponse {
  data?: {
    class?: {
      id: number;
      name: string;
      room?: { id?: number; name?: string } | null;
      branch?: { id?: number; name?: string } | null;
      business?: { id?: number; name?: string } | null;
      schedules?: { weekday?: number; start_time?: string; end_time?: string }[];
    };
  };
}

// ─── UI models ──────────────────────────────────────────────────────────────

export interface ClassSession {
  id: number;
  sessionNo: number | null;
  name: string;
  date: string;
  startTime: string;
  endTime: string;
  status: string;
}

export interface AttendanceClassInfo {
  id: number;
  name: string;
  room: string;
  branch: string;
  scheduleDays: string;
}

/** One student row in the attendance grid — draft status is editable locally. */
export interface AttendanceRow {
  student_id: number;
  name: string;
  avatar: string;
  code: string;
  /** Attendance record id, if one already exists for this session. */
  record_id: number | null;
  /** `null` until the teacher explicitly marks a status. */
  status: AttendanceApiStatus | null;
  /** True once the user changes the status in this session (needs saving). */
  dirty: boolean;
}

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
}

export type AttendanceTab = 'list' | 'report';
