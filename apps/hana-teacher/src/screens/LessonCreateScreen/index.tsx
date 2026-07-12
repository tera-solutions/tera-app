import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from 'react-native';
import { Button, Icon, IconButton } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { ClassRoomService, LessonPlanService, LessonService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import PlanSummaryCard from './components/PlanSummaryCard';
import ClassroomPicker from './components/ClassroomPicker';
import { toClassroomOptions, toPlanSummary } from './_utils';
import { styles } from './styles';

export default function LessonCreateScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const id = planId ? Number(planId) : undefined;

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const planQuery = LessonPlanService.useLessonPlanDetail({ id: id ?? '' });
  const planRaw = planQuery.data?.data?.plan ?? planQuery.data?.data;
  const plan = useMemo(() => toPlanSummary(planRaw), [planRaw]);

  const classroomsQuery = ClassRoomService.useClassRoomList(
    { params: { per_page: 20, filters: { lesson_plan_id: id } } },
    { enabled: !!id },
  );
  const classrooms = useMemo(
    () => toClassroomOptions(classroomsQuery.data?.data?.items),
    [classroomsQuery.data],
  );

  const existingLessonsQuery = LessonService.useLessonList(
    { params: { per_page: 1, filters: { class_room_id: selectedClassId } } },
    { enabled: !!selectedClassId },
  );
  const { pagination: existingPagination } = getListData(existingLessonsQuery.data);
  const existingCount = existingPagination?.total ?? 0;

  const { mutate: generateLessons, isPending: isSubmitting } = LessonService.useLessonGenerate();

  const handleSubmit = () => {
    if (!selectedClassId || !id) {
      Toast.show({ type: 'error', text1: 'Vui lòng chọn lớp học' });
      return;
    }

    generateLessons(
      { id: selectedClassId, params: { lesson_plan_id: id } },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Đã sinh bài học cho lớp' });
          router.back();
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: error?.msg ?? error?.message ?? 'Không thể sinh bài học',
          });
        },
      },
    );
  };

  const notFound = !id || (!planQuery.isLoading && (planQuery.isError || !plan));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.headerBackground}>
        <View style={styles.headerTopRow}>
          <IconButton
            icon={({ size, color }) => <Icon source="chevron-left" size={size} color={color} />}
            iconColor="#FFF"
            size={28}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Sinh bài học</Text>
          <View style={{ width: 40 }} />
        </View>
      </View>

      {notFound ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>Không tìm thấy giáo án</Text>
        </View>
      ) : planQuery.isLoading || !plan ? (
        <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 40 }} />
      ) : (
        <>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <PlanSummaryCard plan={plan} />

            <ClassroomPicker
              classrooms={classrooms}
              selectedId={selectedClassId}
              onSelect={setSelectedClassId}
            />

            {!!selectedClassId && existingCount > 0 && (
              <View style={[styles.noticeCard, styles.noticeCardWarn]}>
                <Icon source="alert-outline" size={18} color="#D97706" />
                <Text style={styles.noticeText}>
                  Lớp này đã có {existingCount} bài học. Sinh bài học có thể tạo trùng lặp — hãy kiểm tra lại danh
                  sách bài học của lớp trước khi tiếp tục.
                </Text>
              </View>
            )}

            {!!selectedClassId && existingCount === 0 && (
              <View style={[styles.noticeCard, styles.noticeCardInfo]}>
                <Icon source="information-outline" size={18} color="#0066CC" />
                <Text style={styles.noticeText}>
                  Hệ thống sẽ tự động sinh bài học cho lớp dựa trên lịch học và các bài học mẫu trong giáo án.
                </Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.bottomBar}>
            <Button
              mode="outlined"
              onPress={() => router.back()}
              disabled={isSubmitting}
              style={styles.bottomBarBtn}
              textColor="#64748B"
            >
              Hủy
            </Button>
            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={isSubmitting}
              disabled={isSubmitting || !selectedClassId}
              style={[styles.bottomBarBtn, styles.btnSubmit]}
            >
              Sinh bài học
            </Button>
          </View>
        </>
      )}
    </View>
  );
}
