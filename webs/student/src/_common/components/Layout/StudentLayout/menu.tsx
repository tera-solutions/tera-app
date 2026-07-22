import {
  AcademicCapOutlined,
  ArrowPathOutlined,
  BookOpenOutlined,
  ClipboardDocumentListOutlined,
  CogOutlined,
  FaceSmileOutlined,
  GiftOutlined,
  HomeOutlined,
  TrophyOutlined,
  UserCircleOutlined,
  UserGroupOutlined,
} from "tera-dls";

import { STUDENT_PAGE_URL } from "_common/constants/url";

export interface IStudentMenuItem {
  key: string;
  /** Key i18n của nhãn menu, vd "menu.home" */
  titleKey: string;
  path: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Các prefix path khác cũng làm mục này sáng, vd /lesson/12 thuộc "Bài học" */
  activePaths?: string[];
}

/** Sidebar desktop — 9 mục theo mockup screen/desktop/trang chu.png */
export const sidebarMenu: IStudentMenuItem[] = [
  {
    key: "home",
    titleKey: "menu.home",
    path: STUDENT_PAGE_URL.home,
    icon: HomeOutlined,
  },
  {
    key: "classes",
    titleKey: "menu.classes",
    path: STUDENT_PAGE_URL.classes,
    icon: AcademicCapOutlined,
  },
  {
    key: "lessons",
    titleKey: "menu.lessons",
    path: STUDENT_PAGE_URL.lessons,
    icon: BookOpenOutlined,
    activePaths: ["/lesson/"],
  },
  {
    key: "exercises",
    titleKey: "menu.exercises",
    path: STUDENT_PAGE_URL.exercises,
    icon: ClipboardDocumentListOutlined,
  },
  {
    key: "practice",
    titleKey: "menu.practice",
    path: STUDENT_PAGE_URL.practice,
    icon: ArrowPathOutlined,
  },
  {
    key: "achievements",
    titleKey: "menu.achievements",
    path: STUDENT_PAGE_URL.achievements,
    icon: TrophyOutlined,
  },
  {
    key: "friends",
    titleKey: "menu.friends",
    path: STUDENT_PAGE_URL.friends,
    icon: UserGroupOutlined,
  },
  {
    key: "parent",
    titleKey: "menu.parent",
    path: STUDENT_PAGE_URL.parentDashboard,
    icon: UserCircleOutlined,
  },
  {
    key: "settings",
    titleKey: "menu.settings",
    path: STUDENT_PAGE_URL.settings,
    icon: CogOutlined,
  },
];

/** Bottom nav mobile — 4 mục theo mockup screen/mobile/lop hoc.png */
export const bottomMenu: IStudentMenuItem[] = [
  {
    key: "home",
    titleKey: "menu.home",
    path: STUDENT_PAGE_URL.home,
    icon: HomeOutlined,
  },
  {
    key: "learn",
    titleKey: "menu.learn",
    path: STUDENT_PAGE_URL.classes,
    icon: BookOpenOutlined,
    activePaths: ["/lessons", "/lesson/", "/practice", "/exercises"],
  },
  {
    key: "rewards",
    titleKey: "menu.rewards",
    path: STUDENT_PAGE_URL.rewards,
    icon: GiftOutlined,
  },
  {
    key: "profile",
    titleKey: "menu.profile",
    path: STUDENT_PAGE_URL.profile,
    icon: FaceSmileOutlined,
  },
];

export const isMenuActive = (
  item: IStudentMenuItem,
  pathname: string,
): boolean =>
  pathname === item.path ||
  pathname.startsWith(`${item.path}/`) ||
  (item.activePaths ?? []).some((p) => pathname.startsWith(p));
