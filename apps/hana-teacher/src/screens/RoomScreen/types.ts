export type RoomStatus = 'active' | 'inactive';

export type AttendanceStatus = 'checked_in' | 'present' | 'absent';

export interface RoomInfo {
  id: string;
  name: string;
  className: string;
  capacity: number;
  equipment: string;
  status: RoomStatus;
  image: number;
  totalStudents: number;
  attendanceDisplay: string;
  lessonCount: number;
  scheduleCount: number;
}

export interface ScheduleItem {
  id: string;
  startTime: string;
  endTime: string;
  lessonTitle: string;
  lessonSubtitle: string;
  image: number;
}

export interface StudentInRoom {
  id: string;
  name: string;
  status: AttendanceStatus;
  avatar: number;
}

export interface ToolItem {
  id: string;
  label: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  route?: string;
}

export interface RoomNotification {
  id: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  time: string;
}

// ── API response types (từ /v1/edu/room/list) ──────────────────

export type RoomType =
  | 'classroom'
  | 'computer_room'
  | 'speaking_room'
  | 'exam_room'
  | 'meeting_room'
  | 'other';

export type RoomApiStatus = 'active' | 'inactive' | 'maintenance';

export interface RoomBranch {
  id: number;
  name: string;
  code?: string;
}

export interface RoomResponse {
  id: number;
  room_code?: string;
  room_name: string;
  floor?: string | null;
  capacity?: number | null;
  room_type?: RoomType;
  status?: RoomApiStatus;
  description?: string | null;
  branch_id?: number;
  branch?: RoomBranch | null;
  active_classes_count?: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface RoomListResponse {
  success: boolean;
  msg?: string;
  code?: number;
  data?: {
    items: RoomResponse[];
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
  };
}
