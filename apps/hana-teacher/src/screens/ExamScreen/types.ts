export type ExamFilterTab = 'all' | 'ongoing' | 'ended' | 'upcoming';

export type ExamStatus = 'ongoing' | 'needs_grading' | 'completed' | 'upcoming';

export interface ExamItem {
  id: string;
  title: string;
  className: string;
  date: string;
  duration: number; // minutes
  studentCount: number;
  status: ExamStatus;
  needsGradingCount?: number;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

export interface ExamStats {
  total: number;
  completed: number;
  ongoing: number;
  upcoming: number;
}

export interface GradeRange {
  label: string;
  range: string;
  percent: number;
  count: number;
  color: string;
}

export interface GradeReport {
  avgPercent: number;
  grades: GradeRange[];
}
