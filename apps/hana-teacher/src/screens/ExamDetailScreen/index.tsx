import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { ExamService, ExamSessionService } from '@tera/modules/education';

import ExamDetailHeader from './components/ExamDetailHeader';
import ExamInfoCard from './components/ExamInfoCard';
import DetailTabs from './components/DetailTabs';
import OverviewTab from './components/tabs/OverviewTab';
import QuestionsTab from './components/tabs/QuestionsTab';
import ResultsTab from './components/tabs/ResultsTab';
import StudentsTab from './components/tabs/StudentsTab';
import SettingsTab from './components/tabs/SettingsTab';
import ActionBar from './components/ActionBar';

import { ExamDetailStats, ExamDetailTab, ExamScoreSummary } from './types';
import { scoreStats, sessionSummaryStats, toExamDetailInfo, toExamResultRows } from './_utils';
import { styles } from './styles';

export default function ExamDetailScreen() {
  const router = useRouter();
  const { sessionId } = useLocalSearchParams<{ sessionId?: string }>();
  const [activeTab, setActiveTab] = useState<ExamDetailTab>('overview');

  const id = sessionId ? Number(sessionId) : undefined;

  const detailQuery = ExamSessionService.useExamSessionDetail({ id: id ?? '' });
  const raw = detailQuery.data?.data;
  const examId = raw?.exam?.id ?? raw?.exam_id ?? null;

  const examQuery = ExamService.useExamDetail({ id: examId ?? '' });
  const exam = examQuery.data?.data;

  const info = useMemo(() => toExamDetailInfo(raw, Number(exam?.duration ?? 0)), [raw, exam]);
  const rows = useMemo(() => toExamResultRows(raw), [raw]);
  const resultStats = useMemo(() => scoreStats(rows), [rows]);
  const summary = useMemo(() => sessionSummaryStats(rows), [rows]);

  const stats: ExamDetailStats = {
    totalStudents: rows.length,
    submitted: summary.submittedCount,
    submittedPercent: summary.completionRate,
    pending: rows.length - summary.submittedCount,
    pendingPercent: rows.length ? 100 - summary.completionRate : 0,
    avgScore: resultStats.avg,
  };

  const scoreSummary: ExamScoreSummary = {
    totalScore: Number(exam?.total_score ?? 0),
    passingScore: Number(exam?.passing_score ?? 0),
    maxScore: resultStats.max,
    minScore: resultStats.min,
  };

  const notFound = !id || (!detailQuery.isLoading && (detailQuery.isError || !info));

  return (
    <View style={styles.container}>
      <ExamDetailHeader
        onEdit={info?.examId ? () => router.push(`/edu/exam-create?examId=${info.examId}`) : undefined}
      />

      {notFound ? (
        <View style={[styles.emptyWrapper, { flex: 1, justifyContent: 'center' }]}>
          <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>Không tìm thấy bài kiểm tra</Text>
        </View>
      ) : detailQuery.isLoading || !info ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ExamInfoCard exam={info} onGrade={() => setActiveTab('results')} />

          <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {activeTab === 'overview' && (
              <OverviewTab
                stats={stats}
                scoreSummary={scoreSummary}
                rows={rows}
                examDate={info.examDate}
                onViewAllStudents={() => setActiveTab('results')}
              />
            )}
            {activeTab === 'questions' && <QuestionsTab />}
            {activeTab === 'results' && <ResultsTab rows={rows} maxScore={scoreSummary.totalScore} />}
            {activeTab === 'students' && <StudentsTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </ScrollView>

          <ActionBar />
        </>
      )}
    </View>
  );
}
