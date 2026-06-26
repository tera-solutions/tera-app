import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';

import ExamHeader from './components/ExamHeader';
import ExamStatsRow from './components/ExamStatsRow';
import GradingBanner from './components/GradingBanner';
import FilterTabs from './components/FilterTabs';
import ExamItem from './components/ExamItem';
import ResultsReport from './components/ResultsReport';

import { ExamFilterTab } from './types';
import { EXAM_STATS, EXAMS, GRADE_REPORT, GRADING_PENDING } from './constants';
import { styles } from './styles';

export default function ExamScreen() {
  const [activeTab, setActiveTab] = useState<ExamFilterTab>('all');

  const filteredExams = useMemo(() => {
    if (activeTab === 'all') return EXAMS;
    if (activeTab === 'ongoing')
      return EXAMS.filter(
        (e) => e.status === 'ongoing' || e.status === 'needs_grading',
      );
    if (activeTab === 'ended')
      return EXAMS.filter((e) => e.status === 'completed');
    if (activeTab === 'upcoming')
      return EXAMS.filter((e) => e.status === 'upcoming');
    return EXAMS;
  }, [activeTab]);

  return (
    <View style={styles.container}>
      <ExamHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ExamStatsRow stats={EXAM_STATS} />

        <GradingBanner count={GRADING_PENDING} />

        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {filteredExams.map((exam) => (
          <ExamItem key={exam.id} item={exam} />
        ))}

        <ResultsReport report={GRADE_REPORT} />
      </ScrollView>
    </View>
  );
}
