import {
  ActivityItem,
  ActivityType,
  DetailTab,
  OverviewStat,
  SkillItem,
  StudentDetail,
} from './types';

export const STUDENT_DETAIL: StudentDetail = {
  id: '1',
  name: 'Nguyễn Minh Anh',
  studentCode: 'HV2025001',
  birthday: '10/06/2014',
  age: 10,
  gender: 'Nam',
  className: 'Lớp Starters 2A',
  avatar: require('@tera/assets/app/element_92.png'),
  isStar: true,
};

export const OVERVIEW_STATS: OverviewStat[] = [
  {
    value: '92%',
    label: 'Tỉ lệ chuyên cần',
    sublabel: '22/24 buổi',
    iconName: 'check-circle',
    iconColor: '#22C55E',
    iconBg: '#ECFDF3',
  },
  {
    value: '8.5',
    label: 'Điểm trung bình',
    sublabel: '8.5/10',
    iconName: 'clipboard-text',
    iconColor: '#2D7DD2',
    iconBg: '#EEF5FF',
  },
  {
    value: 'Tốt',
    label: 'Xếp loại học lực',
    sublabel: '',
    iconName: 'star-four-points',
    iconColor: '#7C3AED',
    iconBg: '#F3E8FF',
  },
  {
    value: '12/15',
    label: 'Bài tập đã nộp',
    sublabel: '80%',
    iconName: 'trending-up',
    iconColor: '#F59E0B',
    iconBg: '#FFF7ED',
  },
];

export const RECENT_ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    type: 'attendance',
    title: 'Điểm danh',
    description: 'Có mặt trong buổi học',
    date: '15/05/2025',
    time: '08:00',
  },
  {
    id: '2',
    type: 'homework',
    title: 'Nộp bài tập',
    description: 'Bài 2: Nghe hiểu – School',
    date: '14/05/2025',
    time: '19:30',
  },
  {
    id: '3',
    type: 'comment',
    title: 'Nhận xét mới',
    description: 'Bài 1: Từ vựng chủ đề Gia đình',
    date: '14/05/2025',
    time: '14:20',
  },
  {
    id: '4',
    type: 'praise',
    title: 'Được giáo viên khen',
    description: 'Chủ động phát biểu trong lớp',
    date: '13/05/2025',
    time: '10:15',
  },
  {
    id: '5',
    type: 'deadline',
    title: 'Hạn nộp bài tập',
    description: 'Bài 3: Ngữ pháp – To be',
    date: '10/05/2025',
    time: '',
    isOverdue: true,
  },
];

export const SKILLS: SkillItem[] = [
  { label: 'Nghe', percent: 90, color: '#22C55E' },
  { label: 'Nói', percent: 85, color: '#2D7DD2' },
  { label: 'Đọc', percent: 80, color: '#7C3AED' },
  { label: 'Viết', percent: 85, color: '#F59E0B' },
];

export const ABSENCE_DATES = ['02/05/2025', '25/04/2025'];

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
  homework: { iconName: 'clipboard-text', color: '#F59E0B', bg: '#FFF7ED' },
  comment: { iconName: 'comment-text', color: '#7C3AED', bg: '#F3E8FF' },
  praise: { iconName: 'star', color: '#2D7DD2', bg: '#EEF5FF' },
  deadline: { iconName: 'calendar-alert', color: '#EF4444', bg: '#FFF1F2' },
};
