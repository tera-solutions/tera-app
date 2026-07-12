import { LessonApiStatus, LessonPlanApiStatus, LessonStatusTab } from './types';

// Ported từ LessonScreen/components/LessonInfoCard.tsx để đồng bộ màu/nhãn trạng thái buổi học toàn app.
export const LESSON_STATUS_CONFIG: Record<
  LessonApiStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  completed: { label: 'Đã giảng', color: '#27AE60', bg: '#E2FBEB', icon: 'check-circle' },
  upcoming: { label: 'Sắp tới', color: '#007AFF', bg: '#EBF5FF', icon: 'clock-outline' },
  ongoing: { label: 'Đang diễn ra', color: '#E67E22', bg: '#FFF4EB', icon: 'play-circle-outline' },
  cancelled: { label: 'Đã hủy', color: '#E74C3C', bg: '#FDF2F0', icon: 'close-circle-outline' },
};

export const STATUS_TABS: { key: LessonStatusTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'ongoing', label: 'Đang diễn ra' },
  { key: 'completed', label: 'Đã giảng' },
  { key: 'cancelled', label: 'Đã hủy' },
];

export const PLAN_STATUS_CONFIG: Record<LessonPlanApiStatus, { label: string; color: string; bg: string }> = {
  draft: { label: 'Nháp', color: '#64748B', bg: '#F1F5F9' },
  reviewing: { label: 'Đang xét duyệt', color: '#F59E0B', bg: '#FFF7ED' },
  published: { label: 'Đã xuất bản', color: '#16A34A', bg: '#F0FDF4' },
  archived: { label: 'Đã lưu trữ', color: '#64748B', bg: '#F1F5F9' },
};
