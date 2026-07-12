import React, { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { ActivityIndicator, Button, Icon, Text } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { AssignmentService, MaterialService, SubmissionService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { DetailHeader } from './components/DetailHeader';
import { AssignmentSummaryCard } from './components/AssignmentSummaryCard';
import { ProgressStats } from './components/ProgressStats';
import { InstructionCard } from './components/InstructionCard';
import { AttachmentsCard } from './components/AttachmentsCard';
import { SubmissionListCard } from './components/SubmissionListCard';
import { toAssignmentDetail, toAttachmentItems, toSubmissionRows } from './_utils';
import type { SubmissionRow } from './types';

export default function AssignmentDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const assignmentId = id ? Number(id) : null;

  const detailQuery = AssignmentService.useAssignmentDetail(
    { id: assignmentId ?? '' },
    { enabled: !!assignmentId },
  );
  const assignment = useMemo(() => toAssignmentDetail(detailQuery.data?.data), [detailQuery.data]);
  const notFound = !detailQuery.isLoading && (detailQuery.isError || !assignment?.id);

  const attachmentsQuery = MaterialService.useMaterialList(
    { params: { per_page: 50, filters: { entity_type: 'assignment', entity_id: assignmentId } } },
    { enabled: !!assignmentId },
  );
  const attachments = useMemo(
    () => toAttachmentItems(getListData<any>(attachmentsQuery.data).items),
    [attachmentsQuery.data],
  );

  const rosterQuery = SubmissionService.useSubmittedList({
    assignmentId: assignmentId ?? '',
    params: { per_page: 100 },
  });
  const rows = useMemo(
    () => toSubmissionRows(getListData<any>(rosterQuery.data).items),
    [rosterQuery.data],
  );

  const goToGrading = (studentId?: number) =>
    router.push(
      `/edu/assignment-grading?id=${assignmentId ?? ''}${studentId ? `&studentId=${studentId}` : ''}`,
    );

  const handleSelectStudent = (row: SubmissionRow) => goToGrading(row.studentId);

  return (
    <View style={styles.container}>
      <DetailHeader />

      {notFound ? (
        <View style={styles.notFoundWrap}>
          <Icon source="file-alert-outline" size={40} color="#94A3B8" />
          <Text style={styles.notFoundText}>Không tìm thấy bài tập hoặc bạn không có quyền truy cập</Text>
          <Button mode="contained" onPress={() => router.back()}>
            Quay lại
          </Button>
        </View>
      ) : detailQuery.isLoading || !assignment ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshing={detailQuery.isFetching}
          onRefresh={detailQuery.refetch}
        >
          <AssignmentSummaryCard assignment={assignment} onGrade={() => goToGrading()} />
          <ProgressStats progress={assignment.progress} />
          <InstructionCard instruction={assignment.instruction} />
          <SubmissionListCard
            rows={rows}
            isLoading={rosterQuery.isLoading}
            maxScore={assignment.maxScore}
            onSelectStudent={handleSelectStudent}
          />
          <AttachmentsCard attachments={attachments} isLoading={attachmentsQuery.isLoading} />
        </ScrollView>
      )}
    </View>
  );
}
