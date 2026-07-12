import {
  RoomInfo,
  RoomNotification,
  ScheduleItem,
  StudentInRoom,
  ToolItem,
} from './types';

export const ROOM_INFO: RoomInfo = {
  id: 'room-1',
  name: 'Phòng 201 - Cơ sở 1',
  className: 'Kids A1 - K24',
  capacity: 30,
  equipment: '1 máy chiếu, 1 màn hình, 1 loa',
  status: 'active',
  image: require('@tera/assets/app/element_105.png'),
  totalStudents: 28,
  attendanceDisplay: '25/28',
  lessonCount: 12,
  scheduleCount: 8,
};

export const TODAY_SCHEDULES: ScheduleItem[] = [
  {
    id: 's1',
    startTime: '17:30',
    endTime: '19:00',
    lessonTitle: 'Unit 5: My Family',
    lessonSubtitle: 'Lesson 2: Family members',
    image: require('@tera/assets/app/element_95.png'),
  },
];

export const STUDENTS_IN_ROOM: StudentInRoom[] = [
  { id: 'st1', name: 'Minh Anh', status: 'checked_in', avatar: require('@tera/assets/app/element_85.png') },
  { id: 'st2', name: 'Gia Bảo', status: 'checked_in', avatar: require('@tera/assets/app/element_86.png') },
  { id: 'st3', name: 'Khánh Linh', status: 'checked_in', avatar: require('@tera/assets/app/element_87.png') },
  { id: 'st4', name: 'Đức Minh', status: 'present', avatar: require('@tera/assets/app/element_88.png') },
  { id: 'st5', name: 'Hải Yến', status: 'absent', avatar: require('@tera/assets/app/element_89.png') },
];

export const IN_CLASS_TOOLS: ToolItem[] = [
  { id: 't1', label: 'Điểm danh', iconName: 'calendar-check', iconBg: '#EEF5FF', iconColor: '#2196F3', route: '/student/attendance' },
  { id: 't2', label: 'Quản lý bài học', iconName: 'book-open-outline', iconBg: '#F0FDF4', iconColor: '#22C55E', route: '/edu/lesson' },
  { id: 't3', label: 'Tài liệu lớp', iconName: 'folder-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
  { id: 't4', label: 'Thông báo', iconName: 'bullhorn-outline', iconBg: '#F5F3FF', iconColor: '#8B5CF6', route: '/setting/notification' },
  { id: 't5', label: 'Chia sẻ màn hình', iconName: 'monitor-share', iconBg: '#FFF1F2', iconColor: '#EF4444' },
  { id: 't6', label: 'Phòng thảo luận', iconName: 'forum-outline', iconBg: '#EEF5FF', iconColor: '#2196F3' },
  { id: 't7', label: 'Quản lý thiết bị', iconName: 'monitor-outline', iconBg: '#F0FDF4', iconColor: '#22C55E' },
  { id: 't8', label: 'Cài đặt', iconName: 'cog-outline', iconBg: '#F4F7FB', iconColor: '#64748B' },
];

export const ROOM_NOTIFICATIONS: RoomNotification[] = [
  {
    id: 'n1',
    iconName: 'bullhorn-outline',
    iconBg: '#EEF5FF',
    iconColor: '#2196F3',
    title: 'Lớp học bắt đầu lúc 17:30 hôm nay',
    description: 'Đừng quên chuẩn bị giáo án và tài liệu trước giờ học.',
    time: '2 phút trước',
  },
  {
    id: 'n2',
    iconName: 'clipboard-check-outline',
    iconBg: '#F0FDF4',
    iconColor: '#22C55E',
    title: 'Đã cập nhật giáo án mới cho Unit 5',
    description: 'Lesson 2: Family members đã được cập nhật.',
    time: '1 giờ trước',
  },
];
