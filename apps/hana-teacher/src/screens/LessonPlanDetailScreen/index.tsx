import { useMemo, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';

import { ClassRoomService, LessonPlanService, LessonService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import PlanHeaderCard from './components/PlanHeaderCard';
import ClassroomChips from './components/ClassroomChips';
import TemplateLessonList from './components/TemplateLessonList';
import LessonListCard from './components/LessonListCard';
import ProgressCard from './components/ProgressCard';
import CancelLessonModal from './components/CancelLessonModal';

import { LessonRow, LessonStatusTab } from './types';
import { toClassrooms, toLessonPlanDetailInfo, toLessonRows, toLessonTemplateSummaries } from './_utils';
import { styles } from './styles';

export default function LessonPlanDetailScreen() {
  const router = useRouter();
  const { planId } = useLocalSearchParams<{ planId?: string }>();
  const id = planId ? Number(planId) : undefined;

  const [selectedClassroomId, setSelectedClassroomId] = useState<number | undefined>(undefined);
  const [activeTab, setActiveTab] = useState<LessonStatusTab>('all');
  const [search, setSearch] = useState('');
  const [cancelling, setCancelling] = useState<LessonRow | null>(null);

  const planQuery = LessonPlanService.useLessonPlanDetail({ id: id ?? '' });
  const detail = planQuery.data?.data;
  const planRaw = detail?.plan ?? detail;
  const plan = useMemo(() => toLessonPlanDetailInfo(planRaw), [planRaw]);
  const templates = useMemo(() => toLessonTemplateSummaries(planRaw?.lessons), [planRaw]);

  const classroomsQuery = ClassRoomService.useClassRoomList(
    { params: { per_page: 20, filters: { lesson_plan_id: id } } },
    { enabled: !!id },
  );
  const classrooms = useMemo(
    () => toClassrooms(classroomsQuery.data?.data?.items),
    [classroomsQuery.data],
  );
  const selectedClassroom =
    classrooms.find((c) => c.id === selectedClassroomId) ?? classrooms[0];

  // Table: lọc theo trạng thái/tìm kiếm.
  const lessonsQuery = LessonService.useLessonList(
    {
      params: {
        per_page: 50,
        search: search || undefined,
        filters: {
          class_room_id: selectedClassroom?.id,
          lesson_plan_id: id,
          status: activeTab === 'all' ? undefined : activeTab,
        },
      },
    },
    { enabled: !!selectedClassroom?.id },
  );
  const { items: lessonItems } = getListData<any>(lessonsQuery.data);
  const rows = useMemo(() => toLessonRows(lessonItems), [lessonItems]);

  // Snapshot không lọc cho thẻ tiến độ — nhu cầu dữ liệu khác với bảng ở trên,
  // không phụ thuộc filter trạng thái/tìm kiếm hiện tại.
  const statsQuery = LessonService.useLessonList(
    {
      params: {
        per_page: 200,
        filters: { class_room_id: selectedClassroom?.id, lesson_plan_id: id },
      },
    },
    { enabled: !!selectedClassroom?.id },
  );
  const { items: statsItems } = getListData<any>(statsQuery.data);
  const allRows = useMemo(() => toLessonRows(statsItems), [statsItems]);

  const { mutate: cancelLesson, isPending: isCancelling } = LessonService.useLessonCancel();

  const handleConfirmCancel = (reason: string) => {
    if (!cancelling || !reason) return;
    cancelLesson(
      { id: cancelling.id, params: { reason } },
      {
        onSuccess: () => {
          Toast.show({ type: 'success', text1: 'Đã hủy buổi học' });
          setCancelling(null);
          lessonsQuery.refetch();
          statsQuery.refetch();
        },
        onError: (error: any) => {
          Toast.show({
            type: 'error',
            text1: error?.msg ?? error?.message ?? 'Hủy buổi học thất bại',
          });
        },
      },
    );
  };

  const handleView = (row: LessonRow) => {
    router.push(`/edu/lesson?lessonId=${row.id}&classId=${selectedClassroom?.id}` as any);
  };

  const isLoading = planQuery.isLoading || classroomsQuery.isLoading || lessonsQuery.isLoading;
  const notFound = !id || (!planQuery.isLoading && (planQuery.isError || !plan));

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('@tera/assets/app/element_46.png')} style={styles.headerBg} resizeMode="cover" />
        <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
          <Icon source="chevron-left" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết giáo án</Text>
        <TouchableOpacity
          style={styles.createBtn}
          onPress={() => router.push(`/edu/lesson-create?planId=${id}` as any)}
        >
          <Icon source="plus" size={14} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Tạo bài học</Text>
        </TouchableOpacity>
      </View>

      {notFound ? (
        <View style={[styles.emptyWrapper, { flex: 1, justifyContent: 'center' }]}>
          <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>Không tìm thấy giáo án</Text>
        </View>
      ) : planQuery.isLoading || !plan ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 40 }} />
      ) : (
        <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
          <PlanHeaderCard plan={plan} />

          <ClassroomChips
            classrooms={classrooms}
            selectedId={selectedClassroom?.id}
            onSelect={setSelectedClassroomId}
          />

          <TemplateLessonList templates={templates} />

          {selectedClassroom ? (
            <>
              <LessonListCard
                rows={rows}
                activeTab={activeTab}
                onTabChange={setActiveTab}
                search={search}
                onSearchChange={setSearch}
                isLoading={isLoading}
                isFetching={lessonsQuery.isFetching}
                isError={lessonsQuery.isError}
                onRetry={() => lessonsQuery.refetch()}
                onView={handleView}
                onCancel={setCancelling}
              />

              <ProgressCard lessons={allRows} />
            </>
          ) : (
            !isLoading && (
              <View style={styles.sectionCard}>
                <View style={styles.emptyWrapper}>
                  <Icon source="google-classroom" size={28} color="#CBD5E1" />
                  <Text style={styles.emptyText}>Chưa có lớp học nào sử dụng giáo án này</Text>
                </View>
              </View>
            )
          )}
        </ScrollView>
      )}

      <CancelLessonModal
        lesson={cancelling}
        loading={isCancelling}
        onCancel={() => setCancelling(null)}
        onConfirm={handleConfirmCancel}
      />
    </View>
  );
}
