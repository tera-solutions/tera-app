import {
  ClassDetail,
  ClassDetailTab,
  AttendanceSummary,
  NextLesson,
  ClassProgress,
  Announcement,
} from './types';

export const CLASS_DETAIL: ClassDetail = {
  id: 'class-001',
  name: 'Kids A1 - K24',
  subject: 'Tiếng Anh',
  level: 'A1 - Beginner',
  schedule: 'Thứ 2, 4, 6 (17:30 - 19:00)',
  room: 'Phòng 201 - Cơ sở 1',
  image: require('@tera/assets/app/element_94.png'),
  color: '#2196F3',
  isActive: true,
  totalStudents: 28,
  attendanceCount: 25,
  lessonCount: 12,
  homeworkCount: 4,
};

export const ATTENDANCE_SUMMARY: AttendanceSummary = {
  present: 25,
  absent: 2,
  excused: 1,
  total: 28,
};

export const NEXT_LESSON: NextLesson = {
  title: 'Unit 5: My Family',
  subtitle: 'Lesson 2: Family members',
  dateLabel: 'Ngày mai',
  time: '17:30',
  image: require('@tera/assets/app/element_95.png'),
};

export const CLASS_PROGRESS: ClassProgress = {
  completed: 12,
  total: 20,
  percent: 60,
};

export const ANNOUNCEMENTS: Announcement[] = [
  { id: '1', text: 'Kiểm tra 15 phút vào thứ 6 tuần này.' },
  { id: '2', text: 'Phụ huynh vui lòng đóng học phí trước ngày 25/05.' },
];

export const DETAIL_TABS: { key: ClassDetailTab; label: string }[] = [
  { key: 'overview', label: 'Tổng quan' },
  { key: 'students', label: 'Học viên' },
  { key: 'schedule', label: 'Lịch học' },
  { key: 'lesson', label: 'Bài học' },
  { key: 'homework', label: 'Bài tập' },
  { key: 'evaluation', label: 'Đánh giá' },
];
