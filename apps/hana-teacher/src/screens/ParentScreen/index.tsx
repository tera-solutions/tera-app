import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { useParentList } from '@tera/modules/crm/parent';
import { getListData } from '@tera/commons/hooks';

import ParentHeader from './components/ParentHeader';
import StatsSection from './components/StatsSection';
import InfoBanner from './components/InfoBanner';
import FilterTabs from './components/FilterTabs';
import SearchBar from './components/SearchBar';
import ParentItem from './components/ParentItem';
import PromoBanner from './components/PromoBanner';
import FAB from './components/FAB';

import { ParentFilterTab, ParentItem as ParentItemType, ParentResponse, ParentStats } from './types';
import { styles } from './styles';

const AVATAR_FALLBACKS = [
  require('@tera/assets/app/element_99.png'),
  require('@tera/assets/app/element_100.png'),
  require('@tera/assets/app/element_101.png'),
  require('@tera/assets/app/element_102.png'),
  require('@tera/assets/app/element_103.png'),
];

// active → contacted, suspended/inactive → not_contacted
function mapToParentItem(parent: ParentResponse, index: number): ParentItemType {
  const isActive = parent.status === 'active';

  return {
    id: String(parent.id),
    name: parent.name ?? '',
    title: 'Chị',
    studentName: '',
    relation: 'Mẹ',
    phone: parent.phone ?? '',
    status: isActive ? 'contacted' : 'not_contacted',
    avatar: AVATAR_FALLBACKS[index % AVATAR_FALLBACKS.length],
  };
}

export default function ParentScreen() {
  const [activeTab, setActiveTab] = useState<ParentFilterTab>('all');
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useParentList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items, pagination } = getListData<ParentResponse>(data);
  const parents = items.map(mapToParentItem);

  const stats: ParentStats = useMemo(() => {
    const contacted = parents.filter((p) => p.status === 'contacted').length;
    return {
      total: pagination.total,
      contacted,
      notContacted: parents.length - contacted,
      newParents: 0,
    };
  }, [parents, pagination.total]);

  const filtered = useMemo(() => {
    let list = parents;

    if (activeTab === 'contacted')
      list = list.filter((p) => p.status === 'contacted');
    else if (activeTab === 'not_contacted')
      list = list.filter((p) => p.status === 'not_contacted');

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.phone.includes(q),
      );
    }

    return list;
  }, [parents, activeTab, search]);

  const handleMessage = (item: ParentItemType) => {};
  const handleCall = (item: ParentItemType) => {};

  return (
    <View style={styles.container}>
      <ParentHeader notificationCount={12} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={isFetching}
        onRefresh={refetch}
        scrollEventThrottle={16}
      >
        <StatsSection stats={stats} />

        <InfoBanner />

        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        <SearchBar value={search} onChangeText={setSearch} />

        {isLoading ? (
          <ActivityIndicator size="large" color="#0B84FF" style={{ marginVertical: 32 }} />
        ) : (
          filtered.map((parent) => (
            <ParentItem
              key={parent.id}
              item={parent}
              onMessage={handleMessage}
              onCall={handleCall}
            />
          ))
        )}

        <PromoBanner />
      </ScrollView>

      <FAB />
    </View>
  );
}
