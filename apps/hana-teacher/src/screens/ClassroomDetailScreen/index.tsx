import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import ClassDetailHeader from './components/ClassDetailHeader';
import ClassInfoCard from './components/ClassInfoCard';
import StatsRow from './components/StatsRow';
import QuickActions from './components/QuickActions';
import DetailTabs from './components/DetailTabs';
import AttendanceCard from './components/AttendanceCard';
import NextLessonCard from './components/NextLessonCard';
import ProgressCard from './components/ProgressCard';
import AnnouncementsCard from './components/AnnouncementsCard';

import { ClassDetailTab } from './types';
import {
  CLASS_DETAIL,
  ATTENDANCE_SUMMARY,
  NEXT_LESSON,
  CLASS_PROGRESS,
  ANNOUNCEMENTS,
} from './constants';
import { styles } from './styles';

export default function ClassroomDetailScreen() {
  const [activeTab, setActiveTab] = useState<ClassDetailTab>('overview');

  return (
    <View style={styles.container}>
      <ClassDetailHeader />

      <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ClassInfoCard detail={CLASS_DETAIL} />

        <StatsRow detail={CLASS_DETAIL} />

        <QuickActions />

        {activeTab === 'overview' && (
          <>
            <AttendanceCard summary={ATTENDANCE_SUMMARY} />

            <NextLessonCard lesson={NEXT_LESSON} />

            <ProgressCard progress={CLASS_PROGRESS} />

            <AnnouncementsCard announcements={ANNOUNCEMENTS} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
