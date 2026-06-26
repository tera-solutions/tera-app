export type DetailTab =
  | 'overview'
  | 'attendance'
  | 'homework'
  | 'result'
  | 'comment'
  | 'info';

export type ActivityType =
  | 'attendance'
  | 'homework'
  | 'comment'
  | 'praise'
  | 'deadline';

export interface StudentDetail {
  id: string;
  name: string;
  studentCode: string;
  birthday: string;
  age: number;
  gender: 'Nam' | 'Nữ';
  className: string;
  avatar: number;
  isStar: boolean;
}

export interface OverviewStat {
  value: string;
  label: string;
  sublabel: string;
  iconName: string;       // react-native-paper icon name
  iconColor: string;
  iconBg: string;
}

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  date: string;
  time: string;
  isOverdue?: boolean;
}

export interface SkillItem {
  label: string;
  percent: number;
  color: string;
}

export interface AbsenceItem {
  date: string;
}
