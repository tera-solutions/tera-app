import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import ParentDetailHeader from './components/ParentDetailHeader';
import ParentProfileCard from './components/ParentProfileCard';
import DetailTabs from './components/DetailTabs';
import ChildSection from './components/ChildSection';
import LearningOverview from './components/LearningOverview';
import LearningProgress from './components/LearningProgress';
import RecentCommunication from './components/RecentCommunication';

import { ParentDetailTab } from './types';
import {
  CHILD_INFO,
  LEARNING_STATS,
  PARENT_DETAIL,
  PROGRESS_POINTS,
  RECENT_COMMUNICATIONS,
} from './constants';
import { styles } from './styles';

export default function ParentDetailScreen() {
  const [activeTab, setActiveTab] = useState<ParentDetailTab>('overview');

  return (
    <View style={styles.container}>
      <ParentDetailHeader />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ParentProfileCard parent={PARENT_DETAIL} />

        <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'overview' && (
          <>
            <ChildSection child={CHILD_INFO} />

            <LearningOverview
              studentName={PARENT_DETAIL.studentName}
              stats={LEARNING_STATS}
            />

            <LearningProgress points={PROGRESS_POINTS} />

            <RecentCommunication items={RECENT_COMMUNICATIONS} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
