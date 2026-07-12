import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TextInput, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { ExamSessionService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import ExamHeader from './components/ExamHeader';
import ExamStatsRow from './components/ExamStatsRow';
import FilterTabs from './components/FilterTabs';
import ExamItem from './components/ExamItem';

import { ExamFilterTab, ExamItem as ExamItemType, ExamSessionResponse, ExamStats, ExamStatus } from './types';
import { styles } from './styles';

// ── Icon config per exam_type ──────────────────────────────────
const EXAM_TYPE_ICON: Record<string, Pick<ExamItemType, 'iconName' | 'iconBg' | 'iconColor'>> = {
  final:    { iconName: 'clipboard-outline',        iconBg: '#FFF7ED', iconColor: '#F97316' },
  midterm:  { iconName: 'file-edit-outline',        iconBg: '#EEF5FF', iconColor: '#2196F3' },
  quiz:     { iconName: 'format-text',              iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  practice: { iconName: 'book-open-outline',        iconBg: '#F0FDF4', iconColor: '#22C55E' },
  other:    { iconName: 'file-document-outline',    iconBg: '#EEF5FF', iconColor: '#2196F3' },
};

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return '';
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function mapToExamItem(session: ExamSessionResponse): ExamItemType {
  const icon = EXAM_TYPE_ICON[session.exam?.exam_type ?? 'other'] ?? EXAM_TYPE_ICON.other;
  const timeRange =
    session.start_time && session.end_time ? `${session.start_time} - ${session.end_time}` : '';

  return {
    id: String(session.id),
    sessionId: session.id,
    title: session.exam?.exam_name ?? '',
    className: session.class?.name ?? '',
    date: formatDate(session.exam_date),
    timeRange,
    studentCount: session.registrations_count ?? 0,
    status: (session.status ?? 'scheduled') as ExamStatus,
    ...icon,
  };
}

const TAB_STATUS: Record<Exclude<ExamFilterTab, 'all'>, ExamStatus> = {
  ongoing: 'in_progress',
  ended: 'closed',
  upcoming: 'scheduled',
};

// ── Screen ─────────────────────────────────────────────────────
export default function ExamScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<ExamFilterTab>('all');
  const [showSearch, setShowSearch] = useState(false);
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, isError, refetch } = ExamSessionService.useExamSessionList({
    params: { per_page: 50 },
  });

  const { items } = getListData<ExamSessionResponse>(data);
  const exams: ExamItemType[] = useMemo(() => items.map(mapToExamItem), [items]);

  // No dedicated summary endpoint — totals are derived from the loaded page.
  const stats: ExamStats = useMemo(
    () => ({
      total: exams.length,
      scheduled: exams.filter((e) => e.status === 'scheduled').length,
      in_progress: exams.filter((e) => e.status === 'in_progress').length,
      closed: exams.filter((e) => e.status === 'closed').length,
    }),
    [exams],
  );

  const filteredExams = useMemo(() => {
    let list = exams;
    if (activeTab !== 'all') {
      const status = TAB_STATUS[activeTab];
      list = list.filter((e) => e.status === status);
    }
    const keyword = search.trim().toLowerCase();
    if (keyword) {
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(keyword) || e.className.toLowerCase().includes(keyword),
      );
    }
    return list;
  }, [exams, activeTab, search]);

  return (
    <View style={styles.container}>
      <ExamHeader onCreateNew={() => router.push('/edu/exam-create')} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={isFetching}
        onRefresh={refetch}
        scrollEventThrottle={16}
      >
        <ExamStatsRow stats={stats} />

        <FilterTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onSearch={() => setShowSearch((v) => !v)}
        />

        {showSearch && (
          <View style={styles.searchRow}>
            <Icon source="magnify" size={18} color="#94A3B8" />
            <TextInput
              style={styles.searchInput}
              placeholder="Tìm kiếm bài kiểm tra theo tên..."
              placeholderTextColor="#94A3B8"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        )}

        {isLoading ? (
          <ActivityIndicator size="large" color="#0B84FF" style={{ marginVertical: 32 }} />
        ) : isError ? (
          <View style={styles.emptyWrapper}>
            <Icon source="alert-circle-outline" size={28} color="#E74C3C" />
            <Text style={styles.emptyText}>Không tải được danh sách bài kiểm tra</Text>
            <Text style={styles.retryText} onPress={() => refetch()}>
              Thử lại
            </Text>
          </View>
        ) : filteredExams.length === 0 ? (
          <View style={styles.emptyWrapper}>
            <Text style={styles.emptyText}>Không có bài kiểm tra nào</Text>
          </View>
        ) : (
          filteredExams.map((exam) => <ExamItem key={exam.id} item={exam} />)
        )}
      </ScrollView>
    </View>
  );
}
