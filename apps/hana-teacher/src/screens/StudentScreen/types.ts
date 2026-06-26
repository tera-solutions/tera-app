export type StudentTab = 'list' | 'absent';

export type AttendanceStatus = 'present' | 'absent';

export type StudentTag =
  | 'Tiến bộ tốt'
  | 'Tích cực'
  | 'Cần cố gắng'
  | 'Xuất sắc'
  | 'Bình thường';

export interface StudentItem {
  id: string;
  index: number;
  name: string;
  birthday: string;
  gender: 'Nam' | 'Nữ';
  rating: number;
  tag: StudentTag;
  tagColor: string;
  tagTextColor: string;
  status: AttendanceStatus;
  attendanceRate: number;
  avatar: number; // require() image
}

export interface ClassInfo {
  id: string;
  name: string;
  ageGroup: string;
  level: string;
  room: string;
  branch: string;
  image: number;
  color: string;
  totalStudents: number;
  presentCount: number;
  absentCount: number;
  attendanceRate: number;
}
