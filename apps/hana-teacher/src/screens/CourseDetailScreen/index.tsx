import { useMemo } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { CourseService } from '@tera/modules/education';

import DetailHeader from './components/DetailHeader';
import SummaryCard from './components/SummaryCard';
import StatsSection from './components/StatsSection';
import InfoSection from './components/InfoSection';
import CurriculumSection from './components/CurriculumSection';

import { toCourseDetailInfo, toCourseStats, toCurriculumItems } from './_utils';
import { styles } from './styles';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { courseId } = useLocalSearchParams<{ courseId?: string }>();

  const detailQuery = CourseService.useCourseDetail({ id: courseId ?? '' });
  const course = detailQuery.data?.data?.course;
  const info = useMemo(() => toCourseDetailInfo(course), [course]);
  const stats = useMemo(() => toCourseStats(detailQuery.data?.data?.statistics), [detailQuery.data]);
  const curriculumItems = useMemo(() => toCurriculumItems(course?.curriculums), [course]);

  const notFound = !courseId || (!detailQuery.isLoading && (detailQuery.isError || !info));

  return (
    <View style={styles.container}>
      {notFound ? (
        <>
          <DetailHeader />
          <View style={styles.emptyWrapper}>
            <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
            <Text>Không tìm thấy khóa học</Text>
          </View>
        </>
      ) : detailQuery.isLoading || !info ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 80 }} />
      ) : (
        <>
          <DetailHeader onEdit={() => router.push(`/edu/course-create?courseId=${info.id}` as any)} />

          <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            <SummaryCard info={info} />
            <StatsSection stats={stats} />
            <InfoSection info={info} />
            <CurriculumSection items={curriculumItems} />
          </ScrollView>
        </>
      )}
    </View>
  );
}
