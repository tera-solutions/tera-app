import { FilterTabItem, NotificationGroupType } from './types';

export const FILTER_TABS: FilterTabItem[] = [
  { key: 'all', label: 'Tất cả' },
  { key: 'unread', label: 'Chưa đọc' },
  { key: 'classroom', label: 'Quản lý lớp' },
  { key: 'homework', label: 'Bài tập' },
  { key: 'system', label: 'Hệ thống' },
];

export const NOTIFICATION_GROUPS: NotificationGroupType[] = [
  {
    date: 'Hôm nay',
    items: [
      {
        id: '1',
        type: 'homework',
        title: 'Bài tập cần chấm',
        description: 'Bài tập "Ngữ pháp – To be" của lớp Movers 1B\ncó 5 bài chưa chấm.',
        time: '09:30',
        isRead: false,
        tag: 'Bài tập',
        tagColor: '#EEF5FF',
        tagTextColor: '#2D7DD2',
      },
      {
        id: '2',
        type: 'classroom',
        title: 'Điểm danh',
        description: 'Lớp Starters 2A có 2 học viên vắng mặt hôm nay.',
        time: '08:15',
        isRead: false,
        tag: 'Quản lý lớp',
        tagColor: '#EEFAF3',
        tagTextColor: '#27AE60',
      },
      {
        id: '3',
        type: 'comment',
        title: 'Nhận xét mới',
        description: 'Bạn có nhận xét mới từ Phạm Khánh Linh\nvề bài tập "Đọc hiểu – My day".',
        time: '07:45',
        isRead: false,
        tag: 'Nhắn xét',
        tagColor: '#FFF0F5',
        tagTextColor: '#E91E8C',
      },
    ],
  },
  {
    date: 'Hôm qua',
    items: [
      {
        id: '4',
        type: 'homework',
        title: 'Bài tập đã nộp',
        description: 'Bài tập "Từ vựng chủ đề Gia đình" của lớp Starters 2A\nđã có 16/22 học viên nộp bài.',
        time: '20:30',
        isRead: true,
        tag: 'Bài tập',
        tagColor: '#EEF5FF',
        tagTextColor: '#2D7DD2',
      },
      {
        id: '5',
        type: 'deadline',
        title: 'Hạn nộp sắp tới',
        description: 'Bài tập "Viết đoạn ngắn" của lớp Starters 2A\nsắp đến hạn nộp vào ngày mai.',
        time: '15:00',
        isRead: true,
        tag: 'Bài tập',
        tagColor: '#FFF3EE',
        tagTextColor: '#E95D1E',
      },
    ],
  },
  {
    date: '12/05/2025',
    items: [
      {
        id: '6',
        type: 'achievement',
        title: 'Thành tích lớp học',
        description: 'Lớp Flyers 3A đạt tỉ lệ hoàn thành bài tập 85%\ntrong tuần qua. Chúc mừng cô và cả lớp!',
        time: '16:20',
        isRead: true,
        tag: 'Quản lý lớp',
        tagColor: '#EEFAF3',
        tagTextColor: '#27AE60',
      },
      {
        id: '7',
        type: 'system',
        title: 'Thông báo từ Hana Edu',
        description: 'Hana Edu cập nhật tính năng mới giúp giáo viên\ndễ dàng tạo và chấm bài tập hơn.',
        time: '10:00',
        isRead: true,
        tag: 'Hệ thống',
        tagColor: '#F0F0FF',
        tagTextColor: '#6C5CE7',
      },
      {
        id: '8',
        type: 'schedule',
        title: 'Lịch dạy ngày mai',
        description: 'Bạn có 3 lớp học vào ngày mai (16/06/2025).\nXem chi tiết lịch dạy.',
        time: '09:00',
        isRead: true,
        tag: 'Hệ thống',
        tagColor: '#F0F0FF',
        tagTextColor: '#6C5CE7',
      },
    ],
  },
];

export const UNREAD_COUNT = 12;
