import {
  ChildInfo,
  CommunicationItem,
  LearningStat,
  ParentDetail,
  ParentDetailTab,
  ProgressPoint,
} from './types';

export const PARENT_DETAIL: ParentDetail = {
  id: 'p1',
  name: 'Nguyễn Thị Hương',
  studentName: 'Minh Anh',
  phone: '0901 234 567',
  email: 'huong.nguyen@email.com',
  address: 'Quận Cầu Giấy, Hà Nội',
  avatar: require('@tera/assets/app/element_106.png'),
  achievementTitle: 'Phụ huynh tích cực',
  achievementDesc: 'Đồng hành tuyệt vời 12 tháng',
  achievementMonths: 12,
};

export const CHILD_INFO: ChildInfo = {
  id: 'c1',
  name: 'Minh Anh',
  className: 'Kids A1 - K24',
  level: 'A1 - Beginner',
  startDate: '09/09/2023',
  endDate: 'Hiện tại',
  avatar: require('@tera/assets/app/element_85.png'),
};

export const LEARNING_STATS: LearningStat[] = [
  {
    value: '28',
    label: 'Bài học đã hoàn thành',
    iconName: 'book-open-outline',
    iconColor: '#2196F3',
    bg: '#EEF5FF',
  },
  {
    value: '92%',
    label: 'Tỷ lệ hoàn thành bài học',
    iconName: 'check-circle-outline',
    iconColor: '#22C55E',
    bg: '#F0FDF4',
  },
  {
    value: '1.250',
    label: 'Điểm tích lũy',
    iconName: 'star-outline',
    iconColor: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    value: '32 giờ',
    label: 'Tổng thời gian học',
    iconName: 'clock-outline',
    iconColor: '#8B5CF6',
    bg: '#F5F3FF',
  },
];

export const PROGRESS_POINTS: ProgressPoint[] = [
  { date: '13/05', percent: 10 },
  { date: '14/05', percent: 28 },
  { date: '15/05', percent: 35 },
  { date: '16/05', percent: 50 },
  { date: '17/05', percent: 55 },
  { date: '18/05', percent: 68 },
  { date: '19/05', percent: 82 },
];

export const RECENT_COMMUNICATIONS: CommunicationItem[] = [
  {
    id: 'c1',
    iconName: 'message-text-outline',
    iconBg: '#EEF5FF',
    iconColor: '#2196F3',
    title: 'Trao đổi về bài kiểm tra Unit 4',
    description: 'Thảo luận về kết quả bài kiểm tra Unit 4 của Minh Anh.',
    date: '18/05/2024',
    time: '10:30',
  },
  {
    id: 'c2',
    iconName: 'phone-outline',
    iconBg: '#F0FDF4',
    iconColor: '#22C55E',
    title: 'Cuộc gọi tư vấn',
    description: 'Tư vấn về lộ trình học tập và phương pháp học hiệu quả.',
    date: '15/05/2024',
    time: '14:15',
  },
];

export const DETAIL_TABS: { key: ParentDetailTab; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'info', label: 'Thông tin' },
  { key: 'children', label: 'Con em' },
  { key: 'history', label: 'Lịch sử' },
  { key: 'notes', label: 'Ghi chú' },
];
