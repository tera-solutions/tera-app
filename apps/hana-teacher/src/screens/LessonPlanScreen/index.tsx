import React, { useMemo, useState } from 'react';
import { View, Text, StatusBar, Image } from 'react-native';
import { Searchbar, Button, IconButton, Icon } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';
import { useRouter } from 'expo-router';

import { useLessonPlanList } from '@tera/modules/education/lesson-plan';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { ClassHeader } from './components/ClassHeader';
import { StatisticCards } from './components/StatisticCards';
import { LessonItem, LessonData } from './components/LessonItem';
import { QuickCreateBanner } from './components/QuickCreateBanner';
import { LessonTabs, TabType } from './components/LessonTabs';
import { LessonPlanResponse, LessonPlanStats } from './types';

// ── Fallback thumbnails ────────────────────────────────────────
const THUMBS = [
  require('@tera/assets/app/element_70.png'),
  require('@tera/assets/app/element_71.png'),
  require('@tera/assets/app/element_72.png'),
  require('@tera/assets/app/element_73.png'),
  require('@tera/assets/app/element_74.png'),
  require('@tera/assets/app/element_75.png'),
];

const STATUS_MAP: Record<string, LessonData['status']> = {
  published: 'done',
  reviewing: 'upcoming',
  draft: 'none',
  archived: 'none',
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function mapToLessonData(plan: LessonPlanResponse, index: number): LessonData {
  return {
    id: String(plan.id),
    index: String(index + 1).padStart(2, '0'),
    title: plan.plan_name,
    unit: plan.course?.name ?? '',
    duration: `${plan.total_lessons ?? plan.lessons_count ?? 0} bài học`,
    status: STATUS_MAP[plan.status ?? ''] ?? 'none',
    date: formatDate(plan.published_at ?? plan.created_at),
    thumb: THUMBS[index % THUMBS.length],
  };
}

// ── Screen ─────────────────────────────────────────────────────
export default function LessonPlanScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<TabType>('plan');

  const { data, isLoading, isFetching, refetch } = useLessonPlanList({
    params: { search: searchQuery || undefined, per_page: 50 },
  });

  const { items, pagination } = getListData<LessonPlanResponse>(data);

  const lessons: LessonData[] = useMemo(
    () => items.map(mapToLessonData),
    [items],
  );

  const filtered = useMemo(() => {
    switch (currentTab) {
      case 'taught': return lessons.filter((l) => l.status === 'done');
      case 'upcoming': return lessons.filter((l) => l.status === 'upcoming');
      case 'all': return lessons;
      default: return lessons; // 'plan' — show all
    }
  }, [lessons, currentTab]);

  const stats: LessonPlanStats = useMemo(() => {
    const published = items.filter((p) => p.status === 'published').length;
    const reviewing = items.filter((p) => p.status === 'reviewing').length;
    const total = pagination.total;
    return {
      total,
      published,
      reviewing,
      progressPercent: total > 0 ? Math.round((published / total) * 100) : 0,
    };
  }, [items, pagination.total]);

  const renderHeaderComponents = () => (
    <View>
      <View
        style={[
          styles.headerBackground,
          { marginTop: 0, borderRadius: 0, borderBottomLeftRadius: 24, borderBottomRightRadius: 24 },
        ]}
      >
        <Image
          source={require('@tera/assets/app/element_46.png')}
          style={styles.headerBackgroundMask}
          resizeMode="cover"
        />
        <View style={styles.headerTopRow}>
          <IconButton
            icon={({ size, color }) => <Icon source="chevron-left" size={size} color={color} />}
            iconColor="#FFF"
            size={32}
            onPress={() => {}}
          />
          <Text style={styles.headerTitle}>Giáo án</Text>
          <IconButton
            icon={({ size, color }) => <Icon source="calendar-range" size={size} color={color} />}
            iconColor="#FFF"
            size={32}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <ClassHeader
          className="Starters 2A"
          level="Beginner"
          room="Phòng 201"
          branch="Cơ sở 1"
          onChangeClass={() => {}}
        />
        <LessonTabs activeTab={currentTab} onTabChange={(tab) => setCurrentTab(tab)} />
        <StatisticCards stats={stats} />
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Tìm kiếm theo tên giáo án, khóa học..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ minHeight: 0 }}
            icon={({ size, color }) => <Icon source="magnify" size={size} color={color} />}
          />
          <Button
            mode="outlined"
            style={styles.btnFilter}
            labelStyle={{ color: '#007AFF' }}
            icon={({ size, color }) => <Icon source="filter-variant" size={size} color="#007AFF" />}
          >
            Bộ lọc
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlashList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.renderItemContainer}>
            <LessonItem
              item={item}
              onPress={() => router.push(`/edu/lesson?id=${item.id}` as any)}
            />
          </View>
        )}
        ListHeaderComponent={renderHeaderComponents}
        ListFooterComponent={<QuickCreateBanner onCreate={() => {}} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        onRefresh={refetch}
        refreshing={isFetching}
      />
    </View>
  );
}
