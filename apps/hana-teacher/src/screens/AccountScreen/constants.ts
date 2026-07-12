import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  Clock3,
  CreditCard,
  Lock,
  Settings,
  Shield,
  Star,
  Users,
} from 'lucide-react-native';

export const STATS = [
  {
    label: 'Lớp đang dạy',
    value: '5',
    icon: BookOpen,
  },
  {
    label: 'Học viên',
    value: '72',
    icon: Users,
  },
  {
    label: 'Đánh giá',
    value: '4.8',
    icon: Star,
  },
  {
    label: 'Chuyên cần',
    value: '98%',
    icon: CalendarDays,
  },
];

export const MENUS = [
  {
    id: 'profile',
    title: 'Hồ sơ cá nhân',
    icon: CreditCard,
    color: '#0066cc',
  },
  {
    id: 'students',
    title: 'Học viên',
    icon: Users,
    color: '#0EA5E9',
    link: '/student/students'
  },
  {
    id: 'teaching',
    title: 'Bài kiểm tra',
    icon: CalendarDays,
    color: '#22C55E',
    link: '/edu/exam'
  },
  {
    id: 'schedule',
    title: 'Phụ huynh',
    icon: Clock3,
    color: '#8B5CF6',
    link: '/student/parent'
  },
  {
    id: 'evaluation',
    title: 'Phòng học',
    icon: BookOpen,
    color: '#F59E0B',
    link: '/edu/room'
  },
  {
    id: 'achievement',
    title: 'Khóa học',
    icon: Award,
    color: '#EC4899',
    link: '/edu/course'
  },
  {
    id: 'account',
    title: 'Thông tin tài khoản',
    icon: CreditCard,
    color: '#3B82F6',
  },
  {
    id: 'security',
    title: 'Bảo mật',
    icon: Shield,
    color: '#14B8A6',
  },
  {
    id: 'notification',
    title: 'Thông báo',
    icon: Bell,
    color: '#FBBF24',
    link: '/setting/notification'
  },
  {
    id: 'setting',
    title: 'Cài đặt',
    icon: Settings,
    color: '#94A3B8',
  },
];