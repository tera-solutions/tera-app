export type DetailTab =
  | 'overview'
  | 'attendance'
  | 'homework'
  | 'result'
  | 'comment'
  | 'info';

export type ActivityType = 'attendance' | 'comment';

export interface StudentParent {
  id: number;
  name: string;
  phone: string;
  email: string;
  relation: string;
}

export interface StudentDetail {
  id: number;
  name: string;
  studentCode: string;
  birthday: string;
  age: number | null;
  gender: string;
  className: string;
  email: string;
  phone: string;
  address: string;
  enrolledAt: string;
  note: string;
  parents: StudentParent[];
}

export interface StudentStats {
  attendanceRate: number;
  totalSessions: number;
  avgScore: number | null;
  assignmentCompletion: number;
  skills: {
    listening: number;
    speaking: number;
    reading: number;
    writing: number;
  };
}

export interface OverviewStat {
  value: string;
  label: string;
  sublabel: string;
  iconName: string;
  iconColor: string;
  iconBg: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  sortKey: string;
}

export interface SkillItem {
  label: string;
  percent: number;
  color: string;
}

export interface AttendanceRow {
  id: number;
  sessionName: string;
  sessionDate: string;
  sessionDateRaw: string;
  status: string;
  note: string;
}

export interface CommentItem {
  id: number;
  content: string;
  date: string;
  dateRaw: string;
}

export interface ScoreItem {
  id: number;
  score: number | null;
  classificationLabel: string | null;
  periodLabel: string | null;
  date: string;
  dateRaw: string;
}

export interface HomeworkItem {
  id: number;
  title: string;
  dueDate: string;
  maxScore: string;
}
