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

// ─── API types ────────────────────────────────────────────────────────────────

export type StudentApiStatus = 'active' | 'suspended' | 'inactive';

export type StudentGender = 'male' | 'female' | null;

export interface StudentParent {
  id: number;
  name: string;
  phone: string;
  email?: string | null;
  relation: 'father' | 'mother' | 'guardian' | string;
}

export interface StudentResponse {
  id: number;
  code: string;
  name: string;
  avatar?: string | null;
  dob?: string | null;
  gender?: StudentGender;
  nationality?: string | null;
  language?: string | null;
  email?: string | null;
  phone?: string | null;
  level_id?: number | null;
  status?: StudentApiStatus;
  enrollment_date?: string | null;
  admission_source?: string | null;
  user_id?: number | null;
  business_id?: number;
  business?: { id: number; name: string } | null;
  branch_id?: number;
  branch?: { id: number; name: string } | null;
  parents?: StudentParent[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
