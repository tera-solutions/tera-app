export type ExamDetailTab = 'overview' | 'questions' | 'results' | 'students' | 'settings';

export type ExamStatus = 'scheduled' | 'in_progress' | 'closed';

export type RegistrationStatus =
  | 'registered'
  | 'in_progress'
  | 'submitted'
  | 'absent'
  | 'graded'
  | 'published';

export type ExamResultGrade = 'excellent' | 'good' | 'pass' | 'fail';

export interface ExamDetailInfo {
  id: number;
  examId: number | null;
  title: string;
  className: string;
  roomName: string;
  teacherName: string;
  duration: number; // minutes
  examDate: string;
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

export interface ExamScoreSummary {
  totalScore: number;
  passingScore: number;
  maxScore: number;
  minScore: number;
}

// ── API response shape (từ /v1/edu/exam-session/detail/:id + /v1/edu/exam/detail/:id) ──

export interface ExamResultRow {
  registrationId: number;
  studentId: number;
  studentCode: string;
  studentName: string;
  registrationStatus: RegistrationStatus;
  totalScore: number | null;
  passed: boolean | null;
  grade: ExamResultGrade | null;
}

export interface ExamScoreStats {
  avg: number;
  max: number;
  min: number;
  passRate: number;
  gradedCount: number;
  totalCount: number;
  pendingCount: number;
}

export interface ExamSessionSummaryStats {
  submittedCount: number;
  completionRate: number;
  needsRegradeCount: number;
}
