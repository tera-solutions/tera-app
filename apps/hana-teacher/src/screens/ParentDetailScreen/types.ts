export type ParentDetailTab =
  | 'overview'
  | 'info'
  | 'children'
  | 'history'
  | 'notes';

export type ChartPeriod = '7 ngày qua' | '30 ngày qua' | '3 tháng qua';

export interface ParentDetail {
  id: string;
  name: string;
  studentName: string;
  phone: string;
  email: string;
  address: string;
  avatar: number;
  achievementTitle: string;
  achievementDesc: string;
  achievementMonths: number;
}

export interface ChildInfo {
  id: string;
  name: string;
  className: string;
  level: string;
  startDate: string;
  endDate: string;
  avatar: number;
}

export interface LearningStat {
  value: string;
  label: string;
  iconName: string;
  iconColor: string;
  bg: string;
}

export interface ProgressPoint {
  date: string;
  percent: number;
}

export interface CommunicationItem {
  id: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  title: string;
  description: string;
  date: string;
  time: string;
}
