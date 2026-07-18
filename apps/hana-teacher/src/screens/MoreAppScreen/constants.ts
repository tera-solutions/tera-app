import {
  Award,
  Bell,
  Bookmark,
  BookOpen,
  CalendarDays,
  Clapperboard,
  Cloud,
  FileText,
  FolderOpen,
  Gamepad2,
  GraduationCap,
  Headphones,
  HelpCircle,
  Heart,
  Info,
  MessageCircle,
  Package,
  PieChart,
  Settings,
  Shield,
  SpellCheck2,
  SquareStack,
  Star,
  Target,
  Trophy,
  UserCheck,
  UserCog,
  Users,
} from 'lucide-react-native';

import type { SectionType, MoreItemType } from './types';

export const PROFILE = {
  name: 'Cô Ngọc',
  role: 'Giáo viên chủ nhiệm',
  school: 'Trường Tiểu học Hana',
  avatarUrl: null as string | null,
};

export const CHUYEN_MON_ITEMS: MoreItemType[] = [
  {
    id: 'giao-an',
    label: 'Giáo án',
    icon: BookOpen,
    color: '#2563EB',
    url: '/edu/lesson-plan',
  },
  {
    id: 'de-kiem-tra',
    label: 'Đề kiểm tra',
    icon: FileText,
    color: '#16A34A',
    url: '/edu/exam',
  },
  {
    id: 'ngan-hang-cau-hoi',
    label: 'Ngân hàng câu hỏi',
    icon: FolderOpen,
    color: '#EA580C',
    url: undefined,
  },
  {
    id: 'tai-lieu-day-hoc',
    label: 'Tài liệu dạy học',
    icon: Bookmark,
    color: '#7C3AED',
    url: '/edu/material',
  },
  {
    id: 'quan-ly-hoc-lieu',
    label: 'Quản lý học liệu',
    icon: Package,
    color: '#0EA5E9',
    url: '/hoc-lieu/quan-ly',
  },
  {
    id: 'danh-sach-tu-vung',
    label: 'Danh sách từ vựng',
    icon: SpellCheck2,
    color: '#DB2777',
    url: '/edu/vocabulary',
  },
  {
    id: 'tao-flashcard',
    label: 'Tạo Flashcard',
    icon: SquareStack,
    color: '#0891B2',
    url: '/edu/flashcard-create',
  },
  {
    id: 'tao-video-tu-vung',
    label: 'Tạo video từ vựng',
    icon: Clapperboard,
    color: '#DC2626',
    url: '/edu/vocabulary-video-create',
  },
  {
    id: 'tao-mini-game-tu-vung',
    label: 'Tạo Mini Game từ vựng',
    icon: Gamepad2,
    color: '#16A34A',
    url: '/edu/mini-game-create',
  },
];

export const LOP_HOC_ITEMS: MoreItemType[] = [
  {
    id: 'danh-sach-lop',
    label: 'Danh sách lớp',
    icon: Users,
    color: '#2563EB',
    url: '/(tabs)/classroom',
  },
  {
    id: 'thoi-khoa-bieu',
    label: 'Thời khóa biểu',
    icon: CalendarDays,
    color: '#16A34A',
    url: '/edu/timetable',
  },
  {
    id: 'phan-cong-giang-day',
    label: 'Phân công giảng dạy',
    icon: UserCog,
    color: '#EA580C',
    url: undefined,
  },
  {
    id: 'bao-cao-lop-hoc',
    label: 'Báo cáo lớp học',
    icon: PieChart,
    color: '#7C3AED',
    url: undefined,
  },
];

export const HOC_SINH_ITEMS: MoreItemType[] = [
  {
    id: 'ho-so-hoc-sinh',
    label: 'Hồ sơ học sinh',
    icon: UserCheck,
    color: '#2563EB',
    url: '/student/students',
  },
  {
    id: 'theo-doi-tien-bo',
    label: 'Theo dõi tiến bộ',
    icon: Target,
    color: '#16A34A',
    url: '/student/attendance',
  },
  {
    id: 'nhan-xet-hoc-sinh',
    label: 'Nhận xét & Đánh giá',
    icon: Heart,
    color: '#EA580C',
    url: '/student/evaluation',
  },
  {
    id: 'khen-thuong',
    label: 'Khen thưởng',
    icon: Award,
    color: '#7C3AED',
    url: '/edu/achievement',
  },
  {
    id: 'bang-xep-hang',
    label: 'Bảng xếp hạng học tập',
    icon: Trophy,
    color: '#F59E0B',
    url: '/student/ranking',
  },
];

export const TIEN_ICH_ITEMS: MoreItemType[] = [
  {
    id: 'thong-bao',
    label: 'Thông báo',
    icon: Bell,
    color: '#2563EB',
    url: '/setting/notification',
  },
  {
    id: 'tin-nhan',
    label: 'Tin nhắn',
    icon: MessageCircle,
    color: '#16A34A',
    url: undefined,
  },
  {
    id: 'luu-tru-dam-may',
    label: 'Lưu trữ đám mây',
    icon: Cloud,
    color: '#EA580C',
    url: undefined,
  },
  {
    id: 'bao-mat',
    label: 'Bảo mật',
    icon: Shield,
    color: '#7C3AED',
    url: undefined,
  },
  {
    id: 'cai-dat',
    label: 'Cài đặt',
    icon: Settings,
    color: '#2563EB',
    url: undefined,
  },
  {
    id: 'tro-giup',
    label: 'Trợ giúp',
    icon: HelpCircle,
    color: '#16A34A',
    url: undefined,
  },
  {
    id: 'ho-tro',
    label: 'Hỗ trợ',
    icon: Headphones,
    color: '#EA580C',
    url: undefined,
  },
  {
    id: 've-hana-edu',
    label: 'Về Hana Edu',
    icon: Info,
    color: '#7C3AED',
    url: undefined,
  },
];

export const MAIN_SECTIONS: SectionType[] = [
  {
    id: 'chuyen-mon',
    title: 'Quản lý chuyên môn',
    items: CHUYEN_MON_ITEMS,
  },
  {
    id: 'lop-hoc',
    title: 'Quản lý lớp học',
    items: LOP_HOC_ITEMS,
  },
  {
    id: 'hoc-sinh',
    title: 'Học sinh',
    items: HOC_SINH_ITEMS,
  },
];
