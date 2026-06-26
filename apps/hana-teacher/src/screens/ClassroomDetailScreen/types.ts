export type ClassDetailTab =
  | 'overview'
  | 'students'
  | 'schedule'
  | 'lesson'
  | 'homework'
  | 'evaluation';

export interface ClassDetail {
  id: string;
  name: string;
  subject: string;
  level: string;
  schedule: string;
  room: string;
  image: number;
  color: string;
  isActive: boolean;
  totalStudents: number;
  attendanceCount: number;
  lessonCount: number;
  homeworkCount: number;
}

export interface AttendanceSummary {
  present: number;
  absent: number;
  excused: number;
  total: number;
}

export interface NextLesson {
  title: string;
  subtitle: string;
  dateLabel: string;
  time: string;
  image: number;
}

export interface ClassProgress {
  completed: number;
  total: number;
  percent: number;
}

export interface Announcement {
  id: string;
  text: string;
}
