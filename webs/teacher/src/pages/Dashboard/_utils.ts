import type { DashboardNotificationItem } from "./_interface";

export const formatNotificationTime = (iso: string): string => {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const toNotification = (raw: any): DashboardNotificationItem => ({
  id: raw.id ?? 0,
  title: raw.title ?? "",
  content: raw.content ?? "",
  type: raw.type ?? "",
  is_read: Boolean(raw.is_read),
  created_at: raw.created_at ?? "",
});
