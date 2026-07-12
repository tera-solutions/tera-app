import moment from 'moment';

import { FilterTabItem, NotificationItemType } from './types';

export const FILTER_TABS: FilterTabItem[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
  { key: 'classroom', label: 'Quản lý lớp' },
  { key: 'homework', label: 'Bài tập' },
  { key: 'system', label: 'Hệ thống' },
];

const today = (hour: number, minute: number) =>
  moment().hour(hour).minute(minute).second(0).millisecond(0).toISOString();

const daysAgo = (days: number, hour: number, minute: number) =>
  moment().subtract(days, 'days').hour(hour).minute(minute).second(0).millisecond(0).toISOString();

/**
 * Static seed data — chưa có backend cho notification queue/read (tương tự
 * ghi chú "task 032 has no working backend yet" bên web), nên màn hình này
 * chạy hoàn toàn trên state cục bộ thay vì gọi `@tera/modules`.
 */
export const MOCK_NOTIFICATIONS: NotificationItemType[] = [
  {
    id: '1',
    type: 'homework',
    title: 'Bài tập cần chấm',
    description: 'Bài tập "Ngữ pháp – To be" của lớp Movers 1B\ncó 5 bài chưa chấm.',
    createdAt: today(9, 30),
    isRead: false,
    tag: 'Bài tập',
    tagColor: '#EEF5FF',
    tagTextColor: '#2D7DD2',
    actionUrl: '/edu/assignment',
  },
  {
    id: '2',
    type: 'classroom',
    title: 'Điểm danh',
    description: 'Lớp Starters 2A có 2 học viên vắng mặt hôm nay.',
    createdAt: today(8, 15),
    isRead: false,
    tag: 'Quản lý lớp',
    tagColor: '#EEFAF3',
    tagTextColor: '#27AE60',
    actionUrl: '/student/attendance',
  },
  {
    id: '3',
    type: 'comment',
    title: 'Nhận xét mới',
    description: 'Bạn có nhận xét mới từ Phạm Khánh Linh\nvề bài tập "Đọc hiểu – My day".',
    createdAt: today(7, 45),
    isRead: false,
    tag: 'Nhận xét',
    tagColor: '#FFF0F5',
    tagTextColor: '#E91E8C',
    actionUrl: '/student/evaluation',
  },
  {
    id: '4',
    type: 'homework',
    title: 'Bài tập đã nộp',
    description: 'Bài tập "Từ vựng chủ đề Gia đình" của lớp Starters 2A\nđã có 16/22 học viên nộp bài.',
    createdAt: daysAgo(1, 20, 30),
    isRead: true,
    tag: 'Bài tập',
    tagColor: '#EEF5FF',
    tagTextColor: '#2D7DD2',
    actionUrl: '/edu/assignment',
  },
  {
    id: '5',
    type: 'deadline',
    title: 'Hạn nộp sắp tới',
    description: 'Bài tập "Viết đoạn ngắn" của lớp Starters 2A\nsắp đến hạn nộp vào ngày mai.',
    createdAt: daysAgo(1, 15, 0),
    isRead: true,
    tag: 'Bài tập',
    tagColor: '#FFF3EE',
    tagTextColor: '#E95D1E',
    actionUrl: '/edu/assignment',
  },
  {
    id: '6',
    type: 'achievement',
    title: 'Thành tích lớp học',
    description: 'Lớp Flyers 3A đạt tỉ lệ hoàn thành bài tập 85%\ntrong tuần qua. Chúc mừng cô và cả lớp!',
    createdAt: daysAgo(3, 16, 20),
    isRead: true,
    tag: 'Quản lý lớp',
    tagColor: '#EEFAF3',
    tagTextColor: '#27AE60',
    actionUrl: '/edu/achievement',
  },
  {
    id: '7',
    type: 'system',
    title: 'Thông báo từ Hana Edu',
    description: 'Hana Edu cập nhật tính năng mới giúp giáo viên\ndễ dàng tạo và chấm bài tập hơn.',
    createdAt: daysAgo(3, 10, 0),
    isRead: true,
    tag: 'Hệ thống',
    tagColor: '#F0F0FF',
    tagTextColor: '#6C5CE7',
    actionUrl: null,
  },
  {
    id: '8',
    type: 'schedule',
    title: 'Lịch dạy ngày mai',
    description: 'Bạn có 3 lớp học vào ngày mai.\nXem chi tiết lịch dạy.',
    createdAt: daysAgo(3, 9, 0),
    isRead: true,
    tag: 'Hệ thống',
    tagColor: '#F0F0FF',
    tagTextColor: '#6C5CE7',
    actionUrl: '/(tabs)/teaching-schedule',
  },
];
