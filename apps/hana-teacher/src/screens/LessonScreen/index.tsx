import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useLocalSearchParams } from 'expo-router';

import { LessonService } from '@tera/modules/education';

import { HeaderCard } from './components/HeaderCard';
import { StatRow } from './components/StatRow';
import { DetailTabs } from './components/DetailTabs';
import { OverviewTab } from './components/tabs/OverviewTab';
import { MaterialsTab } from './components/tabs/MaterialsTab';
import { HomeworkTab } from './components/tabs/HomeworkTab';
import { InfoSidebarCard } from './components/InfoSidebarCard';
import { ProgressDonutCard } from './components/ProgressDonutCard';
import { QuickNoteCard } from './components/QuickNoteCard';
import SkillEvaluationModal from './components/SkillEvaluationModal';

import { toLessonDetail } from './_utils';
import type { LessonDetailTab } from './types';
import { styles } from './styles';

export default function LessonScreen() {
  const { lessonId } = useLocalSearchParams<{ lessonId?: string }>();
  const id = lessonId ? Number(lessonId) : null;

  const [activeTab, setActiveTab] = useState<LessonDetailTab>('overview');
  const [skillEvalOpen, setSkillEvalOpen] = useState(false);

  const detailQuery = LessonService.useLessonDetail({ id: id ?? '' });
  const detail = useMemo(() => toLessonDetail(detailQuery.data?.data?.lesson ?? detailQuery.data?.data), [detailQuery.data]);

  const notFound = !id || (!detailQuery.isLoading && (detailQuery.isError || !detail));

  return (
    <View style={styles.container}>
      {notFound ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>Không tìm thấy bài học hoặc bạn không có quyền truy cập</Text>
        </View>
      ) : detailQuery.isLoading || !detail ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 80 }} />
      ) : (
        <>
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            <HeaderCard detail={detail} />

            <StatRow detail={detail} />

            <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {activeTab === 'overview' && <OverviewTab detail={detail} />}
            {activeTab === 'materials' && <MaterialsTab materials={detail.materials} />}
            {activeTab === 'homework' && <HomeworkTab detail={detail} />}

            <TouchableOpacity style={styles.skillEvalBtn} onPress={() => setSkillEvalOpen(true)}>
              <Icon source="star-outline" size={16} color="#007AFF" />
              <Text style={styles.skillEvalBtnText}>Đánh giá kỹ năng</Text>
            </TouchableOpacity>

            <InfoSidebarCard detail={detail} />
            <ProgressDonutCard activities={detail.activities} />
            <QuickNoteCard lessonId={detail.id} initialNote={detail.lesson_note} />
          </ScrollView>

          <SkillEvaluationModal
            visible={skillEvalOpen}
            classId={detail.class_room_id || null}
            lessonId={detail.id}
            onDismiss={() => setSkillEvalOpen(false)}
          />
        </>
      )}
    </View>
  );
}
