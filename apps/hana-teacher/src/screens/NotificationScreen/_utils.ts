import moment from 'moment';

import { NotificationGroupType, NotificationItemType } from './types';

export function formatTime(iso: string): string {
  const date = moment(iso);
  return date.isValid() ? date.format('HH:mm') : '';
}

function dateLabel(iso: string): string {
  const date = moment(iso);
  if (!date.isValid()) return '';
  const now = moment();
  if (date.isSame(now, 'day')) return 'Hôm nay';
  if (date.isSame(now.clone().subtract(1, 'day'), 'day')) return 'Hôm qua';
  return date.format('DD/MM/YYYY');
}

/** Sorts newest-first, then buckets into "Hôm nay" / "Hôm qua" / "DD/MM/YYYY" sections. */
export function groupByDate(items: NotificationItemType[]): NotificationGroupType[] {
  const sorted = [...items].sort((a, b) => moment(b.createdAt).valueOf() - moment(a.createdAt).valueOf());

  const order: string[] = [];
  const map = new Map<string, NotificationItemType[]>();
  sorted.forEach((item) => {
    const label = dateLabel(item.createdAt);
    if (!map.has(label)) {
      map.set(label, []);
      order.push(label);
    }
    map.get(label)!.push(item);
  });

  return order.map((date) => ({ date, items: map.get(date)! }));
}
