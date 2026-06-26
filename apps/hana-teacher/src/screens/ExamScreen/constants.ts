import {
  ExamFilterTab,
  ExamItem,
  ExamStats,
  GradeReport,
} from './types';

export const EXAM_STATS: ExamStats = {
  total: 18,
  completed: 10,
  ongoing: 5,
  upcoming: 8,
};

export const GRADING_PENDING = 5;

export const FILTER_TABS: { key: ExamFilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'ongoing', label: 'Đang diễn ra' },
  { key: 'ended', label: 'Đã kết thúc' },
  { key: 'upcoming', label: 'Chưa bắt đầu' },
];

export const EXAMS: ExamItem[] = [
  {
    id: 'e1',
    title: 'Bài kiểm tra giữa kỳ II – Toán',
    className: 'Lớp Movers 1B',
    date: '15/05/2025',
    duration: 60,
    studentCount: 20,
    status: 'ongoing',
    iconName: 'file-edit-outline',
    iconBg: '#EEF5FF',
    iconColor: '#2196F3',
  },
  {
    id: 'e2',
    title: 'Bài kiểm tra ngữ pháp – Unit 6',
    className: 'Lớp Starters 2A',
    date: '10/05/2025',
    duration: 45,
    studentCount: 18,
    status: 'needs_grading',
    needsGradingCount: 5,
    iconName: 'clipboard-check-outline',
    iconBg: '#F0FDF4',
    iconColor: '#22C55E',
  },
  {
    id: 'e3',
    title: 'Kiểm tra từ vựng – Unit 5',
    className: 'Lớp Flyers 3A',
    date: '05/05/2025',
    duration: 30,
    studentCount: 22,
    status: 'completed',
    iconName: 'format-text',
    iconBg: '#F5F3FF',
    iconColor: '#8B5CF6',
  },
  {
    id: 'e4',
    title: 'Bài kiểm tra cuối kỳ II – Tiếng Anh',
    className: 'Lớp Movers 1B',
    date: '25/04/2025',
    duration: 90,
    studentCount: 20,
    status: 'completed',
    iconName: 'clipboard-outline',
    iconBg: '#FFF7ED',
    iconColor: '#F97316',
  },
  {
    id: 'e5',
    title: 'Kiểm tra nghe hiểu – Unit 4',
    className: 'Lớp Starters 2A',
    date: '20/04/2025',
    duration: 30,
    studentCount: 18,
    status: 'upcoming',
    iconName: 'calendar-check-outline',
    iconBg: '#FFF1F2',
    iconColor: '#EF4444',
  },
];

export const GRADE_REPORT: GradeReport = {
  avgPercent: 76,
  grades: [
    { label: 'Giỏi', range: '8.5 - 10', percent: 40, count: 8, color: '#2196F3' },
    { label: 'Khá', range: '6.5 - 8.4', percent: 30, count: 6, color: '#22C55E' },
    { label: 'Trung bình', range: '5 - 6.4', percent: 20, count: 4, color: '#F59E0B' },
    { label: 'Yếu', range: '< 5', percent: 10, count: 2, color: '#EF4444' },
  ],
};
