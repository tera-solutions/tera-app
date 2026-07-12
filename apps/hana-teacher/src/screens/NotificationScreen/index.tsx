import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import NotificationHeader from './components/NotificationHeader';
import FilterTabs from './components/FilterTabs';
import UnreadBanner from './components/UnreadBanner';
import NotificationGroup from './components/NotificationGroup';

import { FilterKey, NotificationItemType } from './types';
import { FILTER_TABS, MOCK_NOTIFICATIONS } from './constants';
import { groupByDate } from './_utils';
import { styles } from './styles';

export default function NotificationScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');
  const [items, setItems] = useState<NotificationItemType[]>(MOCK_NOTIFICATIONS);

  const unreadCount = useMemo(() => items.filter((item) => !item.isRead).length, [items]);

  const filteredItems = useMemo(
    () =>
      items.filter((item) => {
        if (activeFilter === 'all') return true;
        if (activeFilter === 'unread') return !item.isRead;
        if (activeFilter === 'classroom') return item.type === 'classroom' || item.type === 'achievement';
        if (activeFilter === 'homework') return item.type === 'homework' || item.type === 'deadline';
        if (activeFilter === 'system') return item.type === 'system' || item.type === 'schedule';
        return true;
      }),
    [items, activeFilter],
  );

  const groups = useMemo(() => groupByDate(filteredItems), [filteredItems]);

  const handleMarkAllRead = () => {
    setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
  };

  const handlePressItem = (item: NotificationItemType) => {
    if (!item.isRead) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? { ...i, isRead: true } : i)));
    }
    if (item.actionUrl) {
      router.push(item.actionUrl as any);
    }
  };

  const handleViewNow = () => {
    setActiveFilter('unread');
  };

  return (
    <View style={styles.container}>
      <NotificationHeader onMarkAllRead={handleMarkAllRead} disabled={unreadCount === 0} />

      <FilterTabs tabs={FILTER_TABS} activeKey={activeFilter} onSelect={setActiveFilter} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <UnreadBanner count={unreadCount} onViewNow={handleViewNow} />

        {groups.map((group) => (
          <NotificationGroup
            key={group.date}
            group={group}
            onPressItem={handlePressItem}
          />
        ))}
      </ScrollView>
    </View>
  );
}
