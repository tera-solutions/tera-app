import { ReactNode } from "react";
import {
  AcademicCapOutlined,
  BookOpenOutlined,
  CalendarDaysOutlined,
  ChartBarOutlined,
  ChatBubbleLeftRightOutlined,
  ClipboardDocumentCheckOutlined,
  DocumentTextOutlined,
  PencilSquareOutlined,
  SquaresPlusOutlined,
  UsersOutlined,
} from "tera-dls";

import { PATHS } from "_common/components/Layout/Menu/menus";

export interface StatMeta {
  key: string;
  label: string;
  icon: ReactNode;
  iconClassName: string;
}

export const STAT_META: Record<
  string,
  { icon: ReactNode; iconClassName: string }
> = {
  students: {
    icon: <AcademicCapOutlined />,
    iconClassName: "bg-sky-50 text-sky-500",
  },
  classes: {
    icon: <UsersOutlined />,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  sessions: {
    icon: <CalendarDaysOutlined />,
    iconClassName: "bg-violet-50 text-violet-500",
  },
  completion: {
    icon: <ChartBarOutlined />,
    iconClassName: "bg-amber-50 text-amber-500",
  },
};

export interface QuickAction {
  label: string;
  icon: ReactNode;
  to: string;
  iconClassName: string;
}

export const QUICK_ACTIONS: QuickAction[] = [
  {
    label: "Điểm danh",
    icon: <ClipboardDocumentCheckOutlined />,
    to: PATHS.attendance,
    iconClassName: "bg-sky-50 text-sky-500",
  },
  {
    label: "Nhập điểm",
    icon: <PencilSquareOutlined />,
    to: PATHS.grading,
    iconClassName: "bg-emerald-50 text-emerald-500",
  },
  {
    label: "Bài tập",
    icon: <DocumentTextOutlined />,
    to: PATHS.homework,
    iconClassName: "bg-orange-50 text-orange-500",
  },
  {
    label: "Nhận xét",
    icon: <ChatBubbleLeftRightOutlined />,
    to: PATHS.comments,
    iconClassName: "bg-violet-50 text-violet-500",
  },
  {
    label: "Lịch dạy",
    icon: <CalendarDaysOutlined />,
    to: PATHS.schedule,
    iconClassName: "bg-sky-50 text-sky-500",
  },
  {
    label: "Giáo án",
    icon: <BookOpenOutlined />,
    to: PATHS.lessonPlans,
    iconClassName: "bg-rose-50 text-rose-500",
  },
  {
    label: "Báo cáo",
    icon: <ChartBarOutlined />,
    to: PATHS.reports,
    iconClassName: "bg-amber-50 text-amber-500",
  },
  {
    label: "Khác",
    icon: <SquaresPlusOutlined />,
    to: PATHS.more,
    iconClassName: "bg-slate-100 text-slate-500",
  },
];
