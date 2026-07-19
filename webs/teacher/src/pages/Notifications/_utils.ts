import moment from "moment";
import {
  CalendarDaysOutlined,
  ClipboardDocumentCheckOutlined,
  Cog6ToothOutlined,
  DocumentTextOutlined,
  MegaphoneOutlined,
} from "tera-dls";

import type {
  NotificationCategory,
  NotificationFilters,
  NotificationItem,
} from "./_interface";

interface RawNotification {
  id: number;
  title: string | null;
  content: string | null;
  type: string | null;
  is_view: boolean;
  created_at: string;
}

/** BE `type` is a free-text string (e.g. "assignment", "attendance_warning"); map
 * it onto the fixed category set the UI groups/filters by. */
export const mapNotificationCategory = (type: string | null): NotificationCategory => {
  const value = (type ?? "").toLowerCase();
  if (value.includes("attendance")) return "attendance";
  if (value.includes("assignment") || value.includes("homework") || value.includes("grading"))
    return "assignment";
  if (value.includes("schedule") || value.includes("session") || value.includes("lesson"))
    return "schedule";
  if (value.includes("system")) return "system";
  return "general";
};

export const toNotificationItem = (raw: RawNotification): NotificationItem => ({
  id: raw.id,
  title: raw.title ?? "",
  content: raw.content ?? "",
  category: mapNotificationCategory(raw.type),
  is_read: !!raw.is_view,
  image_url: null,
  action_url: null,
  action_label: null,
  created_at: raw.created_at,
});

export const CATEGORY_META: Record<
  NotificationCategory,
  { label: string; icon: typeof MegaphoneOutlined; badge: string }
> = {
  general: { label: "Thông báo chung", icon: MegaphoneOutlined, badge: "bg-sky-50 text-brand" },
  schedule: { label: "Lịch dạy", icon: CalendarDaysOutlined, badge: "bg-sky-50 text-brand" },
  assignment: { label: "Bài tập", icon: DocumentTextOutlined, badge: "bg-amber-50 text-amber-600" },
  attendance: { label: "Điểm danh", icon: ClipboardDocumentCheckOutlined, badge: "bg-emerald-50 text-emerald-600" },
  system: { label: "Hệ thống", icon: Cog6ToothOutlined, badge: "bg-violet-50 text-violet-600" },
};

export const CATEGORY_OPTIONS: { value: NotificationCategory; label: string }[] =
  (Object.keys(CATEGORY_META) as NotificationCategory[]).map((value) => ({
    value,
    label: CATEGORY_META[value].label,
  }));

/** "10:30" if today, "Hôm qua" if yesterday, otherwise "DD/MM/YYYY". */
export const formatRelativeTime = (iso: string): string => {
  const date = moment(iso);
  if (!date.isValid()) return "";
  const now = moment();
  if (date.isSame(now, "day")) return date.format("HH:mm");
  if (date.isSame(now.clone().subtract(1, "day"), "day")) return "Hôm qua";
  return date.format("DD/MM/YYYY");
};

export const formatFullDateTime = (iso: string): string => {
  const date = moment(iso);
  return date.isValid() ? date.format("HH:mm, DD/MM/YYYY") : "";
};

export const filterNotifications = (
  items: NotificationItem[],
  filters: NotificationFilters,
): NotificationItem[] =>
  items.filter((item) => {
    if (filters.category !== "all" && item.category !== filters.category) return false;
    if (filters.status === "unread" && item.is_read) return false;
    if (filters.status === "read" && !item.is_read) return false;
    if (filters.date_from && moment(item.created_at).isBefore(moment(filters.date_from), "day"))
      return false;
    if (filters.date_to && moment(item.created_at).isAfter(moment(filters.date_to), "day"))
      return false;
    return true;
  });

export const countByCategory = (
  items: NotificationItem[],
): Record<NotificationCategory | "all", number> => {
  const counts = {
    all: items.length,
    general: 0,
    schedule: 0,
    assignment: 0,
    attendance: 0,
    system: 0,
  };
  items.forEach((item) => {
    counts[item.category] += 1;
  });
  return counts;
};

export const countByStatus = (items: NotificationItem[]) => ({
  all: items.length,
  unread: items.filter((i) => !i.is_read).length,
  read: items.filter((i) => i.is_read).length,
});
