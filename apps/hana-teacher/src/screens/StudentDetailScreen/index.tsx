import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import DetailHeader from './components/DetailHeader';
import DetailTabs from './components/DetailTabs';
import OverviewStats from './components/OverviewStats';
import RecentActivities from './components/RecentActivities';
import SkillsProgress from './components/SkillsProgress';
import AbsenceSection from './components/AbsenceSection';
import ActionBar from './components/ActionBar';

import { DetailTab } from './types';
import {
  ABSENCE_DATES,
  OVERVIEW_STATS,
  RECENT_ACTIVITIES,
  SKILLS,
  STUDENT_DETAIL,
} from './constants';
import { styles } from './styles';

export default function StudentDetailScreen() {
  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  return (
    <View style={styles.container}>
      <DetailHeader student={STUDENT_DETAIL} />

      <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {activeTab === 'overview' && (
          <>
            <OverviewStats stats={OVERVIEW_STATS} />

            <RecentActivities activities={RECENT_ACTIVITIES} />

            <SkillsProgress skills={SKILLS} />

            <AbsenceSection absenceDates={ABSENCE_DATES} />
          </>
        )}
      </ScrollView>

      <ActionBar />
    </View>
  );
}
