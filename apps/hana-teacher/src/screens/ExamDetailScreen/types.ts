export type ExamDetailTab =
  | 'overview'
  | 'questions'
  | 'results'
  | 'students'
  | 'settings';

export type ExamStatus = 'ongoing' | 'needs_grading' | 'completed' | 'upcoming';

export interface ExamDetailInfo {
  id: string;
  title: string;
  className: string;
  subject: string;
  duration: number; // minutes
  startDate: string;
  endDate: string;
  status: ExamStatus;
  iconName: string;
  iconBg: string;
  iconColor: string;
}

export interface ExamDetailStats {
  totalStudents: number;
  submitted: number;
  submittedPercent: number;
  pending: number;
  pendingPercent: number;
  avgScore: number;
}

export interface SubmissionItem {
  id: string;
  name: string;
  submittedAt: string;
  score: number;
  maxScore: number;
  avatar: number;
}

export interface QuestionBankInfo {
  totalQuestions: number;
  multipleChoice: number;
  essay: number;
  totalScore: number;
}
