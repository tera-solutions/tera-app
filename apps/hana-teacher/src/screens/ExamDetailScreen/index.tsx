import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import ExamDetailHeader from './components/ExamDetailHeader';
import ExamInfoCard from './components/ExamInfoCard';
import DetailTabs from './components/DetailTabs';
import ExamStatsRow from './components/ExamStatsRow';
import ProgressSection from './components/ProgressSection';
import DescriptionSection from './components/DescriptionSection';
import QuestionBankSection from './components/QuestionBankSection';
import RecentSubmissions from './components/RecentSubmissions';
import ActionBar from './components/ActionBar';

import { ExamDetailTab } from './types';
import {
  DESCRIPTION,
  EXAM_DETAIL,
  EXAM_STATS,
  PROGRESS,
  QUESTION_BANK,
  RECENT_SUBMISSIONS,
} from './constants';
import { styles } from './styles';

export default function ExamDetailScreen() {
  const [activeTab, setActiveTab] = useState<ExamDetailTab>('overview');

  return (
    <View style={styles.container}>
      <ExamDetailHeader />

      <ExamInfoCard exam={EXAM_DETAIL} />

      <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {activeTab === 'overview' && (
          <>
            <ExamStatsRow stats={EXAM_STATS} />

            <ProgressSection
              percent={PROGRESS.percent}
              updatedAt={PROGRESS.updatedAt}
            />

            <DescriptionSection description={DESCRIPTION} />

            <QuestionBankSection info={QUESTION_BANK} />

            <RecentSubmissions submissions={RECENT_SUBMISSIONS} />
          </>
        )}
      </ScrollView>

      <ActionBar />
    </View>
  );
}
