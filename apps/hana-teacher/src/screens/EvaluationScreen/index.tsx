import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useQueries } from '@tanstack/react-query';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { StudentAPI } from '@tera/api';
import { ClassRoomService, EvaluationService, StudentService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { EvaluationHeader } from './components/EvaluationHeader';
import { SummaryStatsRow } from './components/SummaryStatsRow';
import { StudentEvaluationList } from './components/StudentEvaluationList';
import { StudentDetailPanel } from './components/StudentDetailPanel';
import { toEvaluationEntries, toEvaluationSummary, toStudentEvaluationRows } from './_utils';
import type { StudentEvaluationRow } from './types';

export default function EvaluationScreen() {
  const router = useRouter();
  const { studentId: presetStudentId } = useLocalSearchParams<{ studentId?: string }>();

  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    presetStudentId ? Number(presetStudentId) : null,
  );
  const [search, setSearch] = useState('');

  const summaryQuery = EvaluationService.useEvaluationStudentSummary();
  const summary = useMemo(() => toEvaluationSummary((summaryQuery.data as any)?.data), [summaryQuery.data]);

  const studentsQuery = StudentService.useStudentList({ params: { per_page: 100 } });
  const evaluationsQuery = EvaluationService.useEvaluationList({
    params: { filters: { evaluation_type: 'student' } },
  });
  const isLoading = studentsQuery.isLoading || evaluationsQuery.isLoading;
  const isError = studentsQuery.isError || evaluationsQuery.isError;
  const refetch = () => {
    studentsQuery.refetch();
    evaluationsQuery.refetch();
  };

  const evaluationItems = getListData<any>(evaluationsQuery.data).items;

  // Same roster-scan workaround as Ranking/Parent: the student list carries
  // no class field for the teacher role, so each student's class is resolved
  // by scanning the teacher's own classes' rosters.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => getListData<any>(classesQuery.data).items, [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ['evaluation', 'class-roster', c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });

  const studentClassMap = useMemo(() => {
    const map = new Map<number, number>();
    classes.forEach((c: any, i: number) => {
      const items = getListData<any>(rosterQueries[i]?.data).items;
      items.forEach((s: any) => {
        if (!map.has(s.id)) map.set(s.id, c.id);
      });
    });
    return map;
  }, [classes, rosterQueries]);

  const rows = useMemo(
    () => toStudentEvaluationRows(getListData<any>(studentsQuery.data).items, evaluationItems, studentClassMap),
    [studentsQuery.data, evaluationItems, studentClassMap],
  );
  const filteredRows = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((r) => r.studentName.toLowerCase().includes(keyword));
  }, [rows, search]);

  const selectedRow = rows.find((r) => r.studentId === selectedStudentId) ?? null;
  const comments = useMemo(
    () => (selectedRow ? toEvaluationEntries(evaluationItems, selectedRow.studentId) : []),
    [evaluationItems, selectedRow],
  );

  const goToCreate = (row: StudentEvaluationRow) => {
    router.push(
      `/student/evaluation-create?studentId=${row.studentId}&studentName=${encodeURIComponent(row.studentName)}&classId=${row.classRoomId ?? ''}`,
    );
  };

  // Deep-link from elsewhere (`?studentId=`): pre-select the student and jump
  // straight to the create-evaluation screen once the rows have loaded.
  const presetApplied = useRef(false);
  useEffect(() => {
    if (presetApplied.current || !presetStudentId || rows.length === 0) return;
    const row = rows.find((r) => r.studentId === Number(presetStudentId));
    if (row) {
      setSelectedStudentId(row.studentId);
      presetApplied.current = true;
      goToCreate(row);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [presetStudentId, rows]);

  return (
    <View style={styles.container}>
      <EvaluationHeader />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SummaryStatsRow summary={summary} isLoading={isLoading} />

        <StudentEvaluationList
          rows={filteredRows}
          selectedId={selectedStudentId}
          onSelect={(row) => setSelectedStudentId(row.studentId)}
          search={search}
          onSearchChange={setSearch}
          isLoading={isLoading}
          isError={isError}
          onRetry={refetch}
        />

        <StudentDetailPanel
          student={selectedRow}
          rows={rows}
          comments={comments}
          onAddEvaluation={() => selectedRow && goToCreate(selectedRow)}
        />
      </ScrollView>
    </View>
  );
}
