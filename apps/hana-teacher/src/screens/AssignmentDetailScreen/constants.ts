import type { AssignmentApiStatus, AssignmentType } from '@screens/AssignmentScreen/types';

export const TYPE_LABEL: Record<AssignmentType, string> = {
  homework: 'Bài tập về nhà',
  worksheet: 'Phiếu bài tập',
  quiz: 'Trắc nghiệm nhanh',
  writing: 'Viết',
  speaking: 'Nói',
  listening: 'Nghe',
  reading: 'Đọc',
  project: 'Dự án',
  exam_practice: 'Luyện thi',
};

export const STATUS_META: Record<AssignmentApiStatus, { label: string; bg: string; text: string }> = {
  draft: { label: 'Bản nháp', bg: '#F1F5F9', text: '#64748B' },
  published: { label: 'Đã giao', bg: '#E2FBEB', text: '#27AE60' },
  closed: { label: 'Đã đóng', bg: '#FFF4EB', text: '#E67E22' },
};

export const SUBMISSION_STATUS_META: Record<string, { label: string; bg: string; text: string }> = {
  assigned: { label: 'Chưa nộp', bg: '#F1F5F9', text: '#64748B' },
  submitted: { label: 'Đã nộp', bg: '#EBF5FF', text: '#007AFF' },
  late_submitted: { label: 'Nộp trễ', bg: '#FFF4EB', text: '#E67E22' },
  graded: { label: 'Đã chấm', bg: '#E2FBEB', text: '#27AE60' },
  reviewed: { label: 'Đã duyệt', bg: '#E2FBEB', text: '#27AE60' },
};
