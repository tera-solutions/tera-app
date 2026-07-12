import { ActivityItem, DetailTab } from './types';

export const DETAIL_TABS: { key: DetailTab; label: string; icon: string }[] = [
  { key: 'overview', label: 'Tổng quan', icon: 'view-dashboard-outline' },
  { key: 'attendance', label: 'Điểm danh', icon: 'calendar-check-outline' },
  { key: 'homework', label: 'Bài tập', icon: 'clipboard-text-outline' },
  { key: 'result', label: 'Kết quả', icon: 'monitor-screenshot' },
  { key: 'comment', label: 'Nhận xét', icon: 'comment-outline' },
  { key: 'info', label: 'Thông tin', icon: 'information-outline' },
];

export const ACTIVITY_CONFIG: Record<
  ActivityItem['type'],
  { iconName: string; color: string; bg: string }
> = {
  attendance: { iconName: 'check-circle', color: '#22C55E', bg: '#ECFDF3' },
  comment: { iconName: 'comment-text', color: '#7C3AED', bg: '#F3E8FF' },
};

export const ATTENDANCE_STATUS_LABEL: Record<string, { label: string; color: string; bg: string }> = {
  present: { label: 'Có mặt', color: '#22C55E', bg: '#ECFDF3' },
  absent: { label: 'Vắng mặt', color: '#EF4444', bg: '#FFF1F2' },
  late: { label: 'Đi trễ', color: '#F59E0B', bg: '#FFF7ED' },
  excused: { label: 'Có phép', color: '#2D7DD2', bg: '#EEF5FF' },
};

export const RANK_CONFIG = (avgScore: number | null): { label: string; color: string } => {
  if (avgScore == null) return { label: '—', color: '#64748B' };
  if (avgScore >= 8) return { label: 'Giỏi', color: '#10B981' };
  if (avgScore >= 6.5) return { label: 'Khá', color: '#D97706' };
  return { label: 'Trung bình', color: '#64748B' };
};
