export type RoomStatus = 'active' | 'inactive';

export type AttendanceStatus = 'checked_in' | 'present' | 'absent';

export interface RoomInfo {
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
