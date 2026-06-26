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
  time: string;
  isRead: boolean;
  tag: string;
  tagColor: string;
  tagTextColor?: string;
}

export interface NotificationGroupType {
  date: string;
  items: NotificationItemType[];
}
