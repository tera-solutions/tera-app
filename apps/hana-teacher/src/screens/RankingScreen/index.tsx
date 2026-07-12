import React, { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useQueries } from '@tanstack/react-query';

import { StudentAPI } from '@tera/api';
import { ClassRoomService, EvaluationService, StudentService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { RankingHeader } from './components/RankingHeader';
import { SummaryStats } from './components/SummaryStats';
import { RankingTabBar } from './components/RankingTabBar';
import { MonthFilterChips } from './components/MonthFilterChips';
import { Top3Card } from './components/Top3Card';
import { RankingList } from './components/RankingList';
import { ScoreHistogramCard } from './components/ScoreHistogramCard';
import { ProgressList } from './components/ProgressList';
import { GroupCompareCard } from './components/GroupCompareCard';
import { EvaluationTabPlaceholder } from './components/EvaluationTabPlaceholder';
import { monthKeyOffset, rankedByScore, scoreHistogram, summarize, toProgressRows, toRankingRows } from './_utils';
import type { RankingTab } from './types';

export default function RankingScreen() {
  const [tab, setTab] = useState<RankingTab>('overall');
  const [month, setMonth] = useState(monthKeyOffset(0));

  const studentsQuery = StudentService.useStudentList({ params: { per_page: 200 } });
  const evaluationsQuery = EvaluationService.useEvaluationList({
    params: { per_page: 500, filters: { evaluation_type: 'student' } },
  });
  const isLoading = studentsQuery.isLoading || evaluationsQuery.isLoading;
  const isError = studentsQuery.isError || evaluationsQuery.isError;

  // Same roster-scan workaround as the web page: student list/detail carries
  // no class field for the teacher role, so each student's class is resolved
  // by scanning the teacher's own classes' rosters.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => getListData<any>(classesQuery.data).items, [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ['ranking', 'class-roster', c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });

  const studentClassMap = useMemo(() => {
    const map = new Map<number, string>();
    classes.forEach((c: any, i: number) => {
      const items = getListData<any>(rosterQueries[i]?.data).items;
      items.forEach((s: any) => {
        if (!map.has(s.id)) map.set(s.id, c.name);
      });
    });
    return map;
  }, [classes, rosterQueries]);

  const evaluationItems = getListData<any>(evaluationsQuery.data).items;
  const rows = useMemo(
    () => toRankingRows(getListData<any>(studentsQuery.data).items, evaluationItems, studentClassMap, month),
    [studentsQuery.data, evaluationItems, studentClassMap, month],
  );
  const ranked = useMemo(() => rankedByScore(rows), [rows]);
  const summary = useMemo(() => summarize(rows, classes.length), [rows, classes]);
  const histogram = useMemo(() => scoreHistogram(rows), [rows]);
  const progressRows = useMemo(() => toProgressRows(rows), [rows]);

  return (
    <View style={styles.container}>
      <RankingHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SummaryStats summary={summary} isLoading={isLoading} />
        <RankingTabBar activeTab={tab} onChange={setTab} />

        {tab === 'overall' && (
          <>
            <View style={{ marginBottom: 12 }}>
              <MonthFilterChips value={month} onChange={setMonth} />
            </View>
            <Top3Card top3={ranked.slice(0, 3)} />
            <RankingList
              rows={ranked}
              isLoading={isLoading}
              isError={isError}
              onRetry={() => {
                studentsQuery.refetch();
                evaluationsQuery.refetch();
              }}
            />
            <ScoreHistogramCard buckets={histogram} />
          </>
        )}

        {tab === 'progress' && <ProgressList rows={progressRows} isLoading={isLoading} />}

        {tab === 'group' && <GroupCompareCard rows={ranked} />}

        {tab === 'evaluation' && <EvaluationTabPlaceholder />}
      </ScrollView>
    </View>
  );
}
