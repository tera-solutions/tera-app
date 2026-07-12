import { ExamFilterTab } from './types';

export const FILTER_TABS: { key: ExamFilterTab; label: string }[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'ongoing', label: 'Đang diễn ra' },
  { key: 'ended', label: 'Đã kết thúc' },
  { key: 'upcoming', label: 'Chưa bắt đầu' },
];
