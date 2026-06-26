import {
  ExamDetailInfo,
  ExamDetailStats,
  ExamDetailTab,
  QuestionBankInfo,
  SubmissionItem,
} from './types';

export const EXAM_DETAIL: ExamDetailInfo = {
  id: 'e1',
  title: 'Bài kiểm tra giữa kỳ II – Toán',
  className: 'Lớp Movers 1B',
  subject: 'Toán',
  duration: 60,
  startDate: '15/05/2025 08:00',
  endDate: '15/05/2025 09:00',
  status: 'ongoing',
  iconName: 'file-edit-outline',
  iconBg: '#EEF5FF',
  iconColor: '#2196F3',
};

export const EXAM_STATS: ExamDetailStats = {
  totalStudents: 20,
  submitted: 15,
  submittedPercent: 75,
  pending: 3,
  pendingPercent: 15,
  avgScore: 8.2,
};

export const PROGRESS = {
  percent: 75,
  updatedAt: '09:30 15/05/2025',
};

export const DESCRIPTION =
  'Bài kiểm tra giữa kỳ II giúp đánh giá kiến thức trọng tâm của học viên trong học kỳ II.';

export const QUESTION_BANK: QuestionBankInfo = {
  totalQuestions: 25,
  multipleChoice: 20,
  essay: 5,
  totalScore: 10,
};

export const RECENT_SUBMISSIONS: SubmissionItem[] = [
  {
    id: 's1',
    name: 'Nguyễn Minh Anh',
    submittedAt: '08:45 15/05/2025',
    score: 9.0,
    maxScore: 10,
    avatar: require('@tera/assets/app/element_96.png'),
  },
  {
    id: 's2',
    name: 'Trần Bảo Châu',
    submittedAt: '08:40 15/05/2025',
    score: 8.5,
    maxScore: 10,
    avatar: require('@tera/assets/app/element_97.png'),
  },
  {
    id: 's3',
    name: 'Lê Hoàng Nam',
    submittedAt: '08:30 15/05/2025',
    score: 7.5,
    maxScore: 10,
    avatar: require('@tera/assets/app/element_98.png'),
  },
];

export const DETAIL_TABS: { key: ExamDetailTab; label: string; iconName: string }[] = [
  { key: 'overview', label: 'Tổng quan', iconName: 'chart-pie' },
  { key: 'questions', label: 'Câu hỏi', iconName: 'file-document-outline' },
  { key: 'results', label: 'Kết quả', iconName: 'chart-bar' },
  { key: 'students', label: 'Học viên', iconName: 'account-group-outline' },
  { key: 'settings', label: 'Cài đặt', iconName: 'cog-outline' },
];

export const STATUS_CONFIG = {
  ongoing: { label: 'Đang diễn ra', bg: '#F0FDF4', color: '#16A34A' },
  needs_grading: { label: 'Cần chấm bài', bg: '#FFF7ED', color: '#EA580C' },
  completed: { label: 'Đã hoàn thành', bg: '#F0FDF4', color: '#16A34A' },
  upcoming: { label: 'Chưa bắt đầu', bg: '#F1F5F9', color: '#64748B' },
} as const;
