import type { SubmissionStatus } from './types';

export const SUBMISSION_STATUS_META: Record<SubmissionStatus, { label: string; bg: string; text: string }> = {
  assigned: { label: 'Chưa nộp', bg: '#FFF4EB', text: '#E67E22' },
  submitted: { label: 'Đã nộp', bg: '#E2FBEB', text: '#27AE60' },
  late_submitted: { label: 'Nộp trễ', bg: '#FFF4EB', text: '#E67E22' },
  graded: { label: 'Đã chấm', bg: '#EBF5FF', text: '#007AFF' },
  reviewed: { label: 'Đã chấm', bg: '#EBF5FF', text: '#007AFF' },
};

export const STATUS_FILTERS: { value: 'all' | 'submitted' | 'pending' | 'graded'; label: string }[] = [
  { value: 'all', label: 'Tất cả trạng thái' },
  { value: 'submitted', label: 'Đã nộp — chưa chấm' },
  { value: 'graded', label: 'Đã chấm' },
  { value: 'pending', label: 'Chưa nộp' },
];

export const QUICK_COMMENTS = [
  { text: 'Tốt lắm!', icon: 'thumb-up', color: '#27AE60', bg: '#E2FBEB', border: '#D0F5DD' },
  { text: 'Cố gắng hơn nhé!', icon: 'star-outline', color: '#007AFF', bg: '#EBF5FF', border: '#D0E7FF' },
  { text: 'Bài làm ổn!', icon: 'emoticon-happy-outline', color: '#E67E22', bg: '#FFF4EB', border: '#FFE3CE' },
  { text: 'Xuất sắc!', icon: 'heart', color: '#9B5DE5', bg: '#F5EFFF', border: '#EAD9FF' },
];
