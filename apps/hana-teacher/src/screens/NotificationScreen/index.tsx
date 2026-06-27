import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import NotificationHeader from './components/NotificationHeader';
import FilterTabs from './components/FilterTabs';
import UnreadBanner from './components/UnreadBanner';
import NotificationGroup from './components/NotificationGroup';

import { FilterKey, NotificationItemType } from './types';
import { FILTER_TABS, NOTIFICATION_GROUPS, UNREAD_COUNT } from './constants';
import { styles } from './styles';

export default function NotificationScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredGroups = NOTIFICATION_GROUPS.map((group) => ({
    ...group,
    items: group.items.filter((item) => {
      if (activeFilter === 'all') return true;
      if (activeFilter === 'unread') return !item.isRead;
      if (activeFilter === 'classroom') return item.type === 'classroom' || item.type === 'achievement';
      if (activeFilter === 'homework') return item.type === 'homework' || item.type === 'deadline';
      if (activeFilter === 'system') return item.type === 'system' || item.type === 'schedule';
      return true;
    }),
  })).filter((group) => group.items.length > 0);

  const handleMarkAllRead = () => {
    // TODO: integrate with API
  };

  const handlePressItem = (_item: NotificationItemType) => {
    // TODO: navigate to detail
  };

  const handleViewNow = () => {
    setActiveFilter('unread');
  };

  return (
    <View style={styles.container}>
      <NotificationHeader onMarkAllRead={handleMarkAllRead} />

      <FilterTabs
        tabs={FILTER_TABS}
        activeKey={activeFilter}
        onSelect={setActiveFilter}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <UnreadBanner count={UNREAD_COUNT} onViewNow={handleViewNow} />

        {filteredGroups.map((group) => (
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
