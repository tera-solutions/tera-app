import {
  BoltOutlined,
  BookmarkOutlined,
  BuildingLibraryOutlined,
  CircleStackOutlined,
  CogOutlined,
  DocumentDuplicateOutlined,
  DocumentOutlined,
  EllipsisHorizontalOutlined,
  HomeModernOutlined,
  ListBulletOutlined,
  PrinterOutlined,
  RectangleGroupOutlined,
  UserOutlined,
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
import ConfigPrint from "@tera/commons/system/ConfigPrint";
import DetailConfigPrint from "@tera/commons/system/ConfigPrint/containers/TemplateTab/Detail";
import DetailPrintType from "@tera/commons/system/ConfigPrint/containers/PrintTypeTab/Detail";

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

export const ConfigPrintRouter: IRouteProps[] = [
  {
    key: CONFIG_PRINT_URL.list.key,
    path: CONFIG_PRINT_URL.list.shortenUrl,
    component: <ConfigPrint />,
  },
  {
    key: CONFIG_PRINT_URL.detailTemplate.key,
    path: CONFIG_PRINT_URL.detailTemplate.shortenUrl,
    component: <DetailConfigPrint />,
  },
  {
    key: CONFIG_PRINT_URL.detailPrintType.key,
    path: CONFIG_PRINT_URL.detailPrintType.shortenUrl,
    component: <DetailPrintType />,
  },
];
