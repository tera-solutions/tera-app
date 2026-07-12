export type NotificationType =
  | 'homework'
  | 'classroom'
  | 'comment'
  | 'system'
  | 'achievement'
  | 'schedule'
  | 'deadline';

export type FilterKey = 'all' | 'unread' | 'classroom' | 'homework' | 'system';

export interface FilterTabItem {
  key: FilterKey;
  label: string;
}

export interface NotificationItemType {
  id: string;
  type: NotificationType;
  title: string;
  description: string;
  createdAt: string; // ISO datetime
  isRead: boolean;
  tag: string;
  tagColor: string;
  tagTextColor?: string;
  /** In-app route to navigate to on tap — null when the notification has no target screen. */
  actionUrl?: string | null;
}

export interface NotificationGroupType {
  date: string;
  items: NotificationItemType[];
}
