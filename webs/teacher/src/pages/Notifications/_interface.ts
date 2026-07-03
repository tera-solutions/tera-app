export type NotificationCategory =
  | "general"
  | "schedule"
  | "homework"
  | "attendance"
  | "system";

export type NotificationStatus = "all" | "unread" | "read";

export interface NotificationItem {
  id: number;
  title: string;
  content: string;
  category: NotificationCategory;
  is_read: boolean;
  image_url: string | null;
  action_url: string | null;
  action_label: string | null;
  created_at: string;
}

export interface NotificationFilters {
  category: NotificationCategory | "all";
  status: NotificationStatus;
  date_from: string;
  date_to: string;
}
