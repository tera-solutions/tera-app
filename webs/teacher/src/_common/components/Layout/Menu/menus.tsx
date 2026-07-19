import { ReactNode } from "react";
import {
  AcademicCapOutlined,
  BanknotesOutlined,
  BellOutlined,
  BoltOutlined,
  BookmarkOutlined,
  BookOpenOutlined,
  BuildingLibraryOutlined,
  CalendarDaysOutlined,
  ChartBarOutlined,
  ChatBubbleLeftRightOutlined,
  ChatBubbleOvalLeftOutlined,
  CircleStackOutlined,
  ClipboardDocumentCheckOutlined,
  ClipboardDocumentListOutlined,
  Cog6ToothOutlined,
  CogOutlined,
  DocumentDuplicateOutlined,
  DocumentOutlined,
  DocumentTextOutlined,
  EllipsisHorizontalOutlined,
  FolderOpenOutlined,
  GiftOutlined,
  HomeModernOutlined,
  HomeOutlined,
  ListBulletOutlined,
  PrinterOutlined,
  PuzzlePieceOutlined,
  ReceiptPercentOutlined,
  RectangleGroupOutlined,
  SquaresPlusOutlined,
  PencilSquareOutlined,
  StarOutlined,
  TrophyOutlined,
  UserGroupOutlined,
  UserOutlined,
  UsersOutlined,
  WalletOutlined,
  WrenchScrewdriverOutlined,
} from "tera-dls";

import {
  CONFIG_APPLICATION_URL,
  CONFIG_DATA_URL,
  CONFIG_DEPARTMENT_URL,
  CONFIG_JOB_TITLE_URL,
  CONFIG_PERMISSION_URL,
  CONFIG_POSITION_URL,
  CONFIG_STATUS_URL,
  MANAGE_PAGE_URL,
} from "@tera/commons/constants/url";
import {
  PROCESS_CONFIG_URL,
  CONFIG_APPROVAL_URL,
  CONFIG_EXPORT_DATA_URL,
  CONFIG_IMPORT_DATA_URL,
  MAIL_CONFIG_LIST_URL,
  MAIL_HISTORY_URL,
  MAIL_STATISTIC_URL,
  CONFIG_PRINT_URL,
  CONFIG_TEMPLATE_MAIL_URL,
} from "./url";
import { IMenu, TypeMoreMenu } from "./interface";
import { IRouteProps } from "@tera/commons/interfaces/router";

export const dashboardMenu: IMenu = {
  title: "Trang chủ",
  path: "/dashboard",
  key: "dashboard",
  id: "home",
  icon: "menu1",
};

export const systemMenu: IMenu[] = [
  // {
  //   title: 'Hệ thống',
  //   path: '/system/config-data',
  //   key: 'system',
  //   id: 'system',
  //   icon: 'menu14',
  // },
  // {
  //   title: 'Cấu hình menu',
  //   path: '',
  //   key: 'menu-config',
  //   id: 'menu-config',
  //   icon: 'menu17',
  // },
];

export const systemSubMenu: IMenu[] = [
  {
    iconNode: <DocumentDuplicateOutlined />,
    title: "Nhập xuất dữ liệu",
    key: "import-export-data",
    path: CONFIG_IMPORT_DATA_URL.list.path,
    children: [
      {
        name: "Nhập dữ liệu",
        path: CONFIG_IMPORT_DATA_URL.list.path,
        id: CONFIG_IMPORT_DATA_URL.list.key,
      },
      {
        name: "Xuất dữ liệu",
        path: CONFIG_EXPORT_DATA_URL.list.path,
        id: CONFIG_EXPORT_DATA_URL.list.key,
      },
    ],
  },
  {
    iconNode: <BookmarkOutlined />,
    title: "Biểu mẫu",
    path: CONFIG_TEMPLATE_MAIL_URL.list.path,
    id: CONFIG_TEMPLATE_MAIL_URL.list.key,
    key: "template-mail",
  },
  {
    iconNode: <CircleStackOutlined />,
    title: "Cấu hình dữ liệu",
    path: CONFIG_DATA_URL.list.path,
    id: CONFIG_DATA_URL.list.key,
    key: "config-data",
  },
  {
    iconNode: <ListBulletOutlined />,
    title: "Cấu hình trạng thái",
    path: CONFIG_STATUS_URL.list.path,
    id: CONFIG_STATUS_URL.list.key,
    key: "config-status",
  },
  {
    iconNode: <CogOutlined />,
    title: "Cấu hình mail",
    id: MAIL_CONFIG_LIST_URL.list.key,
    path: MAIL_CONFIG_LIST_URL.list.path,
    key: "mail",
    children: [
      {
        name: "DS cấu hình mail",
        path: MAIL_CONFIG_LIST_URL.list.path,
        id: MAIL_CONFIG_LIST_URL.list.key,
      },
      {
        name: "Lịch sử email",
        path: MAIL_HISTORY_URL.list.path,
        id: MAIL_HISTORY_URL.list.key,
      },
      {
        name: "Thống kê",
        path: MAIL_STATISTIC_URL.list.path,
        id: MAIL_STATISTIC_URL.list.key,
      },
    ],
  },
  {
    iconNode: <PrinterOutlined />,
    title: "Cấu hình mẫu in",
    path: CONFIG_PRINT_URL.list.path,
    id: CONFIG_PRINT_URL.list.key,
    key: "config-print",
  },
  {
    iconNode: <RectangleGroupOutlined />,
    title: "Quy trình duyệt",
    id: CONFIG_APPROVAL_URL.list.key,
    key: CONFIG_APPROVAL_URL.list.key,
    path: CONFIG_APPROVAL_URL.list.path,
    children: [
      {
        name: "Danh sách quy trình",
        path: CONFIG_APPROVAL_URL.list.path,
        id: CONFIG_APPROVAL_URL.list.key,
      },
      {
        name: "Thiết lập quy trình",
        path: PROCESS_CONFIG_URL.list.path,
        id: PROCESS_CONFIG_URL.list.key,
      },
    ],
  },
  {
    iconNode: <DocumentOutlined />,
    title: "Cấu hình loại đơn từ",
    path: CONFIG_APPLICATION_URL.list.path,
    id: CONFIG_APPLICATION_URL.list.key,
  },
  {
    iconNode: <BuildingLibraryOutlined />,
    title: "Cấu hình phòng ban",
    path: CONFIG_DEPARTMENT_URL.list.path,
    id: CONFIG_DEPARTMENT_URL.list.key,
  },
  {
    iconNode: <BoltOutlined />,
    title: "Cấu hình vị trí",
    path: CONFIG_POSITION_URL.list.path,
    id: CONFIG_POSITION_URL.list.key,
  },
  {
    iconNode: <UserOutlined />,
    title: "Cấu hình chức danh",
    path: CONFIG_JOB_TITLE_URL.list.path,
    id: CONFIG_JOB_TITLE_URL.list.key,
  },
  {
    iconNode: <WrenchScrewdriverOutlined />,
    title: "Cấu hình quyền",
    path: CONFIG_PERMISSION_URL.list.path,
    id: CONFIG_PERMISSION_URL.list.key,
  },
  {
    iconNode: <DocumentDuplicateOutlined />,
    title: "Quản lý trang",
    path: MANAGE_PAGE_URL.list.path,
    id: MANAGE_PAGE_URL.list.key,
  },
];

export const moreMenu: TypeMoreMenu[] = [
  {
    icon: <HomeModernOutlined />,
    title: "Dashboard",
    key: "dashboard1",
    path: "/",
    img: { src: "https://via.placeholder.com/1280x720" },
  },
  {
    icon: <EllipsisHorizontalOutlined />,
    title: "More",
    key: "home",
    path: "/",
    img: { src: "https://via.placeholder.com/1280x720" },
  },
];

export const ConfigPrintRouter: IRouteProps[] = [];

export const PATHS = {
  dashboard: "/dashboard",
  classroom: "/classroom",
  schedule: "/schedule",
  lessonPlans: "/lesson-plans",
  assignment: "/assignment",
  assignmentDetail: "/assignment-detail",
  grading: "/grading",
  attendance: "/attendance",
  students: "/students",
  studentDetail: "/student",
  rooms: "/rooms",
  roomDetail: "/room",
  courseDetail: "/course",
  courses: "/courses",
  levels: "/levels",
  exam: "/exam",
  achievement: "/achievement",
  ranking: "/ranking",
  parents: "/parents",
  parentDetail: "/parent",
  enrollmentNew: "/enrollment/new",
  transfer: "/transfer",
  reports: "/reports",
  evaluation: "/evaluation",
  notifications: "/notifications",
  timesheet: "/timesheet",
  payroll: "/payroll",
  teachers: "/teachers",
  leaveRequest: "/leave-request",
  leaveRequestAll: "/leave-requests",
  subscription: "/subscription",
  wallet: "/wallet",
  walletDeposit: "/wallet/deposit",
  walletWithdraw: "/wallet/withdraw",
  messages: "/messages",
  more: "/more",
  profile: "/profile",
  lesson: "/lesson",
  session: "/session",
  materials: "/materials",
  questionBank: "/question-bank",
  invoices: "/invoices",
  settings: "/settings",
  placementTest: "/placement-test",
  packageManagement: "/package-management",
  superadmin: "/superadmin",
  superadminTenants: "/superadmin/tenants",
  superadminTenantDetail: "/superadmin/tenant",
  superadminPackages: "/superadmin/packages",
} as const;

export interface MenuItem {
  key: string;
  title: string;
  path: string;
  icon: ReactNode;
  /** Package feature key required to see this item (see useFeatures). */
  feature?: string;
}

// Ordered to mirror the teaching workflow: Course → Classroom → Timetable
// (incl. generating class sessions) → Attendance → Lesson (via lesson plans)
// → Evaluation, then the remaining catalog/admin pages.
export const MENU: MenuItem[] = [
  {
    key: "dashboard",
    title: "Trang chủ",
    path: PATHS.dashboard,
    icon: <HomeOutlined />,
  },
  {
    key: "courses",
    title: "Khóa học",
    path: PATHS.courses,
    icon: <BookOpenOutlined />,
  },
  {
    key: "classes",
    title: "Lớp học",
    path: PATHS.classroom,
    icon: <UsersOutlined />,
  },
  {
    key: "schedule",
    title: "Lịch dạy",
    path: PATHS.schedule,
    icon: <CalendarDaysOutlined />,
  },
  {
    key: "attendance",
    title: "Điểm danh",
    path: PATHS.attendance,
    icon: <ClipboardDocumentCheckOutlined />,
  },
  {
    key: "lesson-plans",
    title: "Giáo án",
    path: PATHS.lessonPlans,
    icon: <BookOpenOutlined />,
  },
  {
    key: "evaluation",
    title: "Đánh giá",
    path: PATHS.evaluation,
    icon: <ChatBubbleLeftRightOutlined />,
  },
  {
    key: "materials",
    title: "Tài liệu",
    path: PATHS.materials,
    icon: <FolderOpenOutlined />,
  },
  {
    key: "question-bank",
    title: "Ngân hàng câu hỏi",
    path: PATHS.questionBank,
    icon: <PuzzlePieceOutlined />,
  },
  {
    key: "assignment",
    title: "Bài tập",
    path: PATHS.assignment,
    icon: <DocumentTextOutlined />,
    feature: "assignments",
  },
  {
    key: "exam",
    title: "Bài kiểm tra",
    path: PATHS.exam,
    icon: <PencilSquareOutlined />,
  },
  {
    key: "placement-test",
    title: "Kiểm tra đầu vào",
    path: PATHS.placementTest,
    icon: <ClipboardDocumentListOutlined />,
  },
  {
    key: "students",
    title: "Học viên",
    path: PATHS.students,
    icon: <AcademicCapOutlined />,
  },
  {
    key: "levels",
    title: "Trình độ",
    path: PATHS.levels,
    icon: <AcademicCapOutlined />,
  },
  {
    key: "parents",
    title: "Phụ huynh",
    path: PATHS.parents,
    icon: <UserGroupOutlined />,
  },
  {
    key: "rooms",
    title: "Phòng học",
    path: PATHS.rooms,
    icon: <HomeModernOutlined />,
  },
  {
    key: "more",
    title: "Khác",
    path: PATHS.more,
    icon: <SquaresPlusOutlined />,
  },
];

export interface MoreMenuSection {
  key: string;
  title: string;
  items: MenuItem[];
}

// Secondary items, reached via the "Khác" entry above instead of the pinned
// sidebar (webs/teacher/src/pages/More). Grouped by domain so the flat list
// of 14 items doesn't read as an undifferentiated dump.
export const MORE_MENU_SECTIONS: MoreMenuSection[] = [
  {
    key: "academic",
    title: "Học vụ",
    items: [
      {
        key: "achievement",
        title: "Thành tích",
        path: PATHS.achievement,
        icon: <StarOutlined />,
      },
      {
        key: "ranking",
        title: "Xếp hạng",
        path: PATHS.ranking,
        icon: <TrophyOutlined />,
      },
    ],
  },
  {
    key: "hr",
    title: "Nhân sự",
    items: [
      {
        key: "teachers",
        title: "Giáo viên",
        path: PATHS.teachers,
        icon: <UserOutlined />,
      },
      {
        key: "timesheet",
        title: "Bảng công",
        path: PATHS.timesheet,
        icon: <ClipboardDocumentCheckOutlined />,
      },
      {
        key: "payroll",
        title: "Bảng lương",
        path: PATHS.payroll,
        icon: <BanknotesOutlined />,
      },
      {
        key: "leave-request",
        title: "Đơn xin nghỉ",
        path: PATHS.leaveRequestAll,
        icon: <CalendarDaysOutlined />,
      },
    ],
  },
  {
    key: "finance",
    title: "Tài chính",
    items: [
      {
        key: "wallet",
        title: "Ví cá nhân",
        path: PATHS.wallet,
        icon: <WalletOutlined />,
      },
      {
        key: "invoices",
        title: "Hóa đơn",
        path: PATHS.invoices,
        icon: <ReceiptPercentOutlined />,
      },
      {
        key: "package-management",
        title: "Gói đã đăng ký",
        path: PATHS.packageManagement,
        icon: <GiftOutlined />,
      },
    ],
  },
  {
    key: "other",
    title: "Khác",
    items: [
      {
        key: "reports",
        title: "Báo cáo",
        path: PATHS.reports,
        icon: <ChartBarOutlined />,
        feature: "advanced_reports",
      },
      {
        key: "settings",
        title: "Cài đặt",
        path: PATHS.settings,
        icon: <Cog6ToothOutlined />,
      },
    ],
  },
];

export const MORE_MENU_ITEMS: MenuItem[] = MORE_MENU_SECTIONS.flatMap((section) => section.items);

export const BOTTOM_NAV: MenuItem[] = [
  {
    key: "dashboard",
    title: "Trang chủ",
    path: PATHS.dashboard,
    icon: <HomeOutlined />,
  },
  {
    key: "classes",
    title: "Lớp học",
    path: PATHS.classroom,
    icon: <UsersOutlined />,
  },
  {
    key: "notifications",
    title: "Thông báo",
    path: PATHS.notifications,
    icon: <BellOutlined />,
  },
  {
    key: "messages",
    title: "Tin nhắn",
    path: PATHS.messages,
    icon: <ChatBubbleOvalLeftOutlined />,
    feature: "messaging",
  },
  {
    key: "profile",
    title: "Cá nhân",
    path: PATHS.profile,
    icon: <UserOutlined />,
  },
];

// Platform-superadmin section. Rendered only when the signed-in user is a
// superadmin (globalStore.user.is_superadmin); see pages/More and SuperadminRoute.
export const SUPERADMIN_MENU_ITEMS: MenuItem[] = [
  {
    key: "superadmin-dashboard",
    title: "Tổng quan nền tảng",
    path: PATHS.superadmin,
    icon: <ChartBarOutlined />,
  },
  {
    key: "superadmin-tenants",
    title: "Quản lý trung tâm",
    path: PATHS.superadminTenants,
    icon: <BuildingLibraryOutlined />,
  },
  {
    key: "superadmin-packages",
    title: "Gói dịch vụ",
    path: PATHS.superadminPackages,
    icon: <RectangleGroupOutlined />,
  },
];
