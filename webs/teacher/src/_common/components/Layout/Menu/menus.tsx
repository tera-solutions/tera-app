import { ReactNode } from "react";
import {
  AcademicCapOutlined,
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
  CogOutlined,
  DocumentDuplicateOutlined,
  DocumentOutlined,
  DocumentTextOutlined,
  EllipsisHorizontalOutlined,
  HomeModernOutlined,
  HomeOutlined,
  ListBulletOutlined,
  PrinterOutlined,
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
  wallet: "/wallet",
  // Menu active dò segment ("wallet" nằm trong pathname) → sidebar vẫn sáng ở "Ví cá nhân".
  walletDeposit: "/wallet/deposit",
  messages: "/messages",
  more: "/more",
  profile: "/profile",
  lesson: "/lesson",
} as const;

export interface MenuItem {
  key: string;
  title: string;
  path: string;
  icon: ReactNode;
}

export const MENU: MenuItem[] = [
  {
    key: "dashboard",
    title: "Trang chủ",
    path: PATHS.dashboard,
    icon: <HomeOutlined />,
  },
  {
    key: "schedule",
    title: "Lịch dạy",
    path: PATHS.schedule,
    icon: <CalendarDaysOutlined />,
  },
  {
    key: "classes",
    title: "Lớp học",
    path: PATHS.classroom,
    icon: <UsersOutlined />,
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
    key: "assignment",
    title: "Bài tập",
    path: PATHS.assignment,
    icon: <DocumentTextOutlined />,
  },
  {
    key: "exam",
    title: "Bài kiểm tra",
    path: PATHS.exam,
    icon: <PencilSquareOutlined />,
  },
  {
    key: "students",
    title: "Học viên",
    path: PATHS.students,
    icon: <AcademicCapOutlined />,
  },
  {
    key: "evaluation",
    title: "Đánh giá",
    path: PATHS.evaluation,
    icon: <ChatBubbleLeftRightOutlined />,
  },
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
    key: "reports",
    title: "Báo cáo",
    path: PATHS.reports,
    icon: <ChartBarOutlined />,
  },
  {
    key: "notifications",
    title: "Thông báo",
    path: PATHS.notifications,
    icon: <BellOutlined />,
  },
  {
    key: "wallet",
    title: "Ví cá nhân",
    path: PATHS.wallet,
    icon: <WalletOutlined />,
  },
  {
    key: "more",
    title: "Khác",
    path: PATHS.more,
    icon: <SquaresPlusOutlined />,
  },
];

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
  },
  {
    key: "profile",
    title: "Cá nhân",
    path: PATHS.profile,
    icon: <UserOutlined />,
  },
];
