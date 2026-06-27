import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';

import { useExamList } from '@tera/modules/education/exam';
import { getListData } from '@tera/commons/hooks';

import ExamHeader from './components/ExamHeader';
import ExamStatsRow from './components/ExamStatsRow';
import GradingBanner from './components/GradingBanner';
import FilterTabs from './components/FilterTabs';
import ExamItem from './components/ExamItem';
import ResultsReport from './components/ResultsReport';

import { ExamFilterTab, ExamItem as ExamItemType, ExamResponse, ExamStats } from './types';
import { GRADE_REPORT } from './constants';
import { styles } from './styles';

// ── Icon config per exam_type ──────────────────────────────────
const EXAM_TYPE_ICON: Record<string, Pick<ExamItemType, 'iconName' | 'iconBg' | 'iconColor'>> = {
  final:    { iconName: 'clipboard-outline',        iconBg: '#FFF7ED', iconColor: '#F97316' },
  midterm:  { iconName: 'file-edit-outline',        iconBg: '#EEF5FF', iconColor: '#2196F3' },
  quiz:     { iconName: 'format-text',              iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  practice: { iconName: 'book-open-outline',        iconBg: '#F0FDF4', iconColor: '#22C55E' },
  other:    { iconName: 'file-document-outline',    iconBg: '#EEF5FF', iconColor: '#2196F3' },
};

// API status → UI ExamStatus
const STATUS_MAP: Record<string, ExamItemType['status']> = {
  draft:     'upcoming',
  published: 'upcoming',
  active:    'ongoing',
  completed: 'completed',
  archived:  'completed',
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function mapToExamItem(exam: ExamResponse): ExamItemType {
  const icon = EXAM_TYPE_ICON[exam.exam_type ?? 'other'] ?? EXAM_TYPE_ICON.other;
  const courseName = exam.course?.name ?? '';
  const levelName = exam.level?.level_name ?? '';
  const className = [courseName, levelName].filter(Boolean).join(' - ');

  return {
    id: String(exam.id),
    title: exam.exam_name,
    className,
    date: formatDate(exam.created_at),
    duration: exam.duration ?? 0,
    studentCount: 0,
    status: STATUS_MAP[exam.status ?? ''] ?? 'upcoming',
    ...icon,
  };
}

// ── Screen ─────────────────────────────────────────────────────
export default function ExamScreen() {
  const [activeTab, setActiveTab] = useState<ExamFilterTab>('all');

  const { data, isLoading, isFetching, refetch } = useExamList({
    params: { per_page: 50 },
  });

  const { items, pagination } = getListData<ExamResponse>(data);
  const exams: ExamItemType[] = useMemo(() => items.map(mapToExamItem), [items]);

  const stats: ExamStats = useMemo(() => ({
    total: pagination.total,
    completed: items.filter((e) => e.status === 'completed' || e.status === 'archived').length,
    ongoing:   items.filter((e) => e.status === 'active').length,
    upcoming:  items.filter((e) => e.status === 'draft' || e.status === 'published').length,
  }), [items, pagination.total]);

  const gradingPending = useMemo(
    () => exams.filter((e) => e.status === 'needs_grading').length,
    [exams],
  );

  const filteredExams = useMemo(() => {
    if (activeTab === 'ongoing')
      return exams.filter((e) => e.status === 'ongoing' || e.status === 'needs_grading');
    if (activeTab === 'ended')
      return exams.filter((e) => e.status === 'completed');
    if (activeTab === 'upcoming')
      return exams.filter((e) => e.status === 'upcoming');
    return exams;
  }, [exams, activeTab]);

  return (
    <View style={styles.container}>
      <ExamHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={isFetching}
        onRefresh={refetch}
        scrollEventThrottle={16}
      >
        <ExamStatsRow stats={stats} />

        <GradingBanner count={gradingPending} />

        <FilterTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {isLoading ? (
          <ActivityIndicator size="large" color="#0B84FF" style={{ marginVertical: 32 }} />
        ) : (
          filteredExams.map((exam) => (
            <ExamItem key={exam.id} item={exam} />
          ))
        )}

        <ResultsReport report={GRADE_REPORT} />
      </ScrollView>
    </View>
  );
}
