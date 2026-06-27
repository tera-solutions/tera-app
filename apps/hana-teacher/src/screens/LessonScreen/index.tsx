import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useLessonList } from '@tera/modules/education/lesson';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { HeaderSection } from './components/HeaderSection';
import { LessonInfoCard } from './components/LessonInfoCard';
import { TabNavigation, LessonTab } from './components/TabNavigation';
import { OverviewTab } from './components/OverviewTab';
import { MaterialTab } from './components/MaterialTab';
import { BottomActions } from './components/BottomActions';

import { LessonResponse, LessonStats } from './types';

const TABS: LessonTab[] = [
  { value: 'overview',  text: 'Tổng quan' },
  { value: 'content',   text: 'Nội dung' },
  { value: 'activity',  text: 'Hoạt động' },
  { value: 'material',  text: 'Tài liệu' },
  { value: 'note',      text: 'Ghi chú' },
];

export default function LessonScreen() {
  const [activeTab, setActiveTab] = useState('overview');
  const { lessonId, classId } = useLocalSearchParams<{
    lessonId?: string;
    classId?: string;
  }>();

  const { data, isLoading } = useLessonList({
    params: {
      per_page: 50,
      filters: {
        ...(classId ? { class_room_id: classId } : {}),
      },
    },
  });

  const { items, pagination } = getListData<LessonResponse>(data);

  // Ưu tiên lessonId từ route params, fallback về item đầu tiên
  const currentLesson: LessonResponse | undefined = lessonId
    ? items.find((l) => String(l.id) === lessonId)
    : items[0];

  const stats: LessonStats = {
    total:     pagination.total,
    completed: items.filter((l) => l.status === 'completed').length,
    upcoming:  items.filter((l) => l.status === 'upcoming').length,
    ongoing:   items.filter((l) => l.status === 'ongoing').length,
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <HeaderSection />

        <LessonInfoCard lesson={currentLesson} isLoading={isLoading} />

        <TabNavigation
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        {activeTab === 'overview' && <OverviewTab stats={stats} />}

        {activeTab === 'material' && (
          <MaterialTab lessonId={lessonId} />
        )}
      </ScrollView>

      <BottomActions />
    </View>
  );
}
