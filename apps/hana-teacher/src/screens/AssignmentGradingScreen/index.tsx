import React, { useEffect, useMemo, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { ActivityIndicator, Button, Icon, Text } from 'react-native-paper';
import { useForm } from 'react-hook-form';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { AssignmentService, SubmissionService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { GradingHeader } from './components/GradingHeader';
import { AssignmentInfo } from './components/AssignmentInfo';
import { GradingMetrics } from './components/GradingMetrics';
import { GradingTabs } from './components/GradingTabs';
import { StudentListSide } from './components/StudentListSide';
import { DetailGradingSide } from './components/DetailGradingSide';
import { GradingFooter } from './components/GradingFooter';
import { ResultStats } from './components/ResultStats';
import { isGraded, toGradingHeader, toSubmissionDetail, toSubmissionRows } from './_utils';
import type { GradeFormValues, SubmissionRow } from './types';

const isTablet = Dimensions.get('window').width > 600;

export default function AssignmentGradingScreen() {
  const router = useRouter();
  const { id, studentId } = useLocalSearchParams<{ id?: string; studentId?: string }>();
  const assignmentId = id ? Number(id) : null;

  const [activeTab, setActiveTab] = useState('list');
  const [selectedStudentId, setSelectedStudentId] = useState<number | null>(
    studentId ? Number(studentId) : null,
  );

  const detailQuery = AssignmentService.useAssignmentDetail(
    { id: assignmentId ?? '' },
    { enabled: !!assignmentId },
  );
  const header = useMemo(() => toGradingHeader(detailQuery.data?.data), [detailQuery.data]);
  const notFound = !detailQuery.isLoading && (detailQuery.isError || !header?.id);

  const rosterQuery = SubmissionService.useSubmittedList({
    assignmentId: assignmentId ?? '',
    params: { per_page: 100 },
  });
  const rows = useMemo(
    () => toSubmissionRows(getListData<any>(rosterQuery.data).items),
    [rosterQuery.data],
  );

  // No student pre-selected via params yet — default to the first submission once the roster loads.
  useEffect(() => {
    if (selectedStudentId != null || rows.length === 0) return;
    setSelectedStudentId(rows[0].studentId);
  }, [rows, selectedStudentId]);

  const currentIndex = rows.findIndex((r) => r.studentId === selectedStudentId);
  const selected = currentIndex >= 0 ? rows[currentIndex] : null;

  const submissionQuery = SubmissionService.useSubmissionDetail(
    { id: selected?.id ?? '' },
    { enabled: !!selected },
  );
  const submission = useMemo(
    () => (submissionQuery.data?.data ? toSubmissionDetail(submissionQuery.data.data) : undefined),
    [submissionQuery.data],
  );

  const form = useForm<GradeFormValues>({ mode: 'onChange', defaultValues: { score: 0, comment: '' } });
  useEffect(() => {
    form.reset({ score: submission?.score ?? 0, comment: submission?.comment ?? '' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submission]);

  const { mutate: gradeSubmission, isPending: isGrading } = SubmissionService.useSubmissionGrade();
  const { mutate: updateSubmission, isPending: isUpdating } = SubmissionService.useSubmissionUpdate();
  const isSubmitting = isGrading || isUpdating;

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < rows.length - 1;

  const goToStudent = (row: SubmissionRow) => setSelectedStudentId(row.studentId);
  const goPrev = () => hasPrev && setSelectedStudentId(rows[currentIndex - 1].studentId);
  const goNext = () => hasNext && setSelectedStudentId(rows[currentIndex + 1].studentId);

  const handleSave = form.handleSubmit(
    (values) => {
      if (!submission) return;
      const mutate = isGraded(submission.status) ? updateSubmission : gradeSubmission;
      mutate(
        { id: submission.id, params: values },
        {
          onSuccess: () => {
            Toast.show({ type: 'success', text1: 'Lưu điểm thành công' });
            rosterQuery.refetch();
            submissionQuery.refetch();
            goNext();
          },
          onError: (error: any) => {
            Toast.show({ type: 'error', text1: error?.msg ?? error?.message ?? 'Không thể lưu điểm' });
          },
        },
      );
    },
    () => {
      Toast.show({ type: 'error', text1: 'Vui lòng kiểm tra lại điểm số' });
    },
  );

  const handleQuickComment = (text: string) => {
    const current = form.getValues('comment');
    form.setValue('comment', current ? `${current} ${text}` : text, { shouldDirty: true });
  };

  return (
    <View style={styles.container}>
      <GradingHeader title={header?.name} />

      {notFound ? (
        <View style={styles.notFoundWrap}>
          <Icon source="file-alert-outline" size={40} color="#94A3B8" />
          <Text style={styles.notFoundText}>Không tìm thấy bài tập hoặc bạn không có quyền truy cập</Text>
          <Button mode="contained" onPress={() => router.back()}>
            Quay lại
          </Button>
        </View>
      ) : detailQuery.isLoading || !header ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <>
          <AssignmentInfo header={header} />

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
            <GradingMetrics progress={header.progress} />
            <GradingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {activeTab === 'list' ? (
              <View style={styles.mainContentLayout}>
                <StudentListSide students={rows} selectedId={selected?.id ?? null} onSelectStudent={goToStudent} />

                {(isTablet || selected) && (
                  <DetailGradingSide
                    hasSelection={!!selected}
                    isLoading={submissionQuery.isLoading}
                    isError={submissionQuery.isError}
                    onRetry={() => submissionQuery.refetch()}
                    student={selected}
                    submission={submission}
                    maxScore={header.maxScore}
                    control={form.control}
                    errors={form.formState.errors}
                    commentValue={form.watch('comment') ?? ''}
                    onQuickComment={handleQuickComment}
                    onPrev={goPrev}
                    onNext={goNext}
                    hasPrev={hasPrev}
                    hasNext={hasNext}
                  />
                )}
              </View>
            ) : (
              <ResultStats rows={rows} maxScore={header.maxScore} />
            )}
          </ScrollView>

          <GradingFooter
            hasPrev={hasPrev}
            hasNext={hasNext}
            isSubmitting={isSubmitting}
            disabled={!submission || submission.status === 'assigned'}
            onPrev={goPrev}
            onSave={handleSave}
          />
        </>
      )}
    </View>
  );
}
