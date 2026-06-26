import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import ParentHeader from './components/ParentHeader';
import StatsSection from './components/StatsSection';
import InfoBanner from './components/InfoBanner';
import FilterTabs from './components/FilterTabs';
import SearchBar from './components/SearchBar';
import ParentItem from './components/ParentItem';
import PromoBanner from './components/PromoBanner';
import FAB from './components/FAB';

import { ParentFilterTab, ParentItem as ParentItemType } from './types';
import { PARENT_STATS, PARENTS } from './constants';
import { styles } from './styles';

export default function ParentScreen() {
  const [activeTab, setActiveTab] = useState<ParentFilterTab>('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    let list = PARENTS;

    if (activeTab === 'contacted')
      list = list.filter((p) => p.status === 'contacted');
    else if (activeTab === 'not_contacted')
      list = list.filter((p) => p.status === 'not_contacted');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.studentName.toLowerCase().includes(q) ||
          p.phone.includes(q),
      );
    }

    return list;
  }, [activeTab, search]);

  const handleMessage = (item: ParentItemType) => {
    // Navigate to message screen
  };

  const handleCall = (item: ParentItemType) => {
    // Open phone dialer
  };

  return (
    <View style={styles.container}>
      <ParentHeader notificationCount={12} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <StatsSection stats={PARENT_STATS} />

        <InfoBanner />

        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <SearchBar value={search} onChangeText={setSearch} />

        {filtered.map((parent) => (
          <ParentItem
            key={parent.id}
            item={parent}
            onMessage={handleMessage}
            onCall={handleCall}
          />
        ))}

        <PromoBanner />
      </ScrollView>

      <FAB />
    </View>
  );
}
