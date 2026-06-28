export type AttendanceStatus =
  | 'present'
  | 'late'
  | 'absent'
  | 'unmarked';

export interface StudentAttendance {
  id: string;
  no: string;
  avatar: string;
  fullName: string;
  status: AttendanceStatus;
  checkInTime?: string;
}

// ─── API types ────────────────────────────────────────────────────────────────

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
  created_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceStats {
  total: number;
  present: number;
  late: number;
  absent: number;
}