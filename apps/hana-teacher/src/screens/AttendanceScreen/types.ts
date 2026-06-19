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