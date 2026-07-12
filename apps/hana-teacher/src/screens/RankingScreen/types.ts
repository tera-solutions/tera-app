export type RankingTab = 'overall' | 'progress' | 'group' | 'evaluation';

export interface RankingSummary {
  totalStudents: number;
  avgScore: number;
  totalClasses: number;
  goodRate: number;
}

export interface RankingRow {
  studentId: number;
  studentName: string;
  studentAvatar: string;
  className: string;
  score: number | null;
  classificationLabel: string | null;
  history: number[];
  prevMonthScore: number | null;
  currMonthScore: number | null;
}

export interface ProgressRow extends RankingRow {
  deltaPct: number;
}

export interface MonthOption {
  value: string; // "YYYY-MM"
  label: string;
}
