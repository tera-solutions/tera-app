import { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useQueries } from '@tanstack/react-query';

import {
  AssignmentService,
  AttendanceService,
  ClassRoomService,
  EvaluationService,
  StudentService,
} from '@tera/modules/education';
import { StudentAPI } from '@tera/api';
import { getListData } from '@tera/commons/hooks';

import DetailHeader from './components/DetailHeader';
import DetailTabs from './components/DetailTabs';
import OverviewStats from './components/OverviewStats';
import RecentActivities from './components/RecentActivities';
import SkillsProgress from './components/SkillsProgress';
import AbsenceSection from './components/AbsenceSection';
import ActionBar from './components/ActionBar';
import AttendanceTab from './components/tabs/AttendanceTab';
import ScoresTab from './components/tabs/ScoresTab';
import CommentsTab from './components/tabs/CommentsTab';
import HomeworkTab from './components/tabs/HomeworkTab';
import InfoTab from './components/tabs/InfoTab';

import { DetailTab, OverviewStat } from './types';
import { RANK_CONFIG } from './constants';
import {
  buildRecentActivities,
  toAttendanceRows,
  toComments,
  toHomeworkItems,
  toScores,
  toStudentDetail,
  toStudentStats,
} from './_utils';
import { styles } from './styles';

export default function StudentDetailScreen() {
  const router = useRouter();
  const { studentId } = useLocalSearchParams<{ studentId?: string }>();
  const id = studentId ? Number(studentId) : undefined;

  const [activeTab, setActiveTab] = useState<DetailTab>('overview');

  const detailQuery = StudentService.useStudentDetail({ id: id ?? '' });
  const detail = useMemo(() => toStudentDetail(detailQuery.data?.data?.student), [detailQuery.data]);

  const statsQuery = StudentService.useStudentStats({ id: id ?? '' });
  const stats = useMemo(() => toStudentStats(statsQuery.data?.data), [statsQuery.data]);

  // Học viên không có API student→class cho vai trò giáo viên, nên lớp hiện tại
  // được xác định bằng cách quét roster từng lớp giáo viên phụ trách.
  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const { items: classes } = getListData<any>(classesQuery.data);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ['student-detail', 'class-roster', c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: !!id && classes.length > 0,
    })),
  });
  const rosterLoading = rosterQueries.some((q) => q.isLoading);

  const currentClass = useMemo(() => {
    for (let i = 0; i < classes.length; i++) {
      const items = (rosterQueries[i]?.data as any)?.data?.items ?? [];
      if (items.some((s: any) => s.id === id)) return classes[i];
    }
    return null;
  }, [classes, rosterQueries, id]);

  const evaluationsQuery = EvaluationService.useEvaluationList({
    params: { filters: { evaluation_type: 'student', target_id: id ?? undefined } },
  });
  const { items: evaluationItems } = getListData<any>(evaluationsQuery.data);
  const comments = useMemo(() => toComments(evaluationItems), [evaluationItems]);
  const scores = useMemo(() => toScores(evaluationItems), [evaluationItems]);

  const attendanceQuery = AttendanceService.useAttendanceList(
    { params: { per_page: 50, filters: { student_id: id ?? 0 } } },
    { enabled: !!id },
  );
  const { items: attendanceItems } = getListData<any>(attendanceQuery.data);
  const attendanceRows = useMemo(() => toAttendanceRows(attendanceItems), [attendanceItems]);
  const absenceDates = useMemo(
    () => attendanceRows.filter((r) => r.status === 'absent').map((r) => r.sessionDate),
    [attendanceRows],
  );

  const homeworkQuery = AssignmentService.useAssignmentList(
    { params: { per_page: 50, filters: { class_room_id: currentClass?.id } } },
    { enabled: !!currentClass?.id },
  );
  const { items: homeworkItems } = getListData<any>(homeworkQuery.data);
  const homework = useMemo(() => toHomeworkItems(homeworkItems), [homeworkItems]);

  const recentActivities = useMemo(
    () => buildRecentActivities(attendanceRows, comments),
    [attendanceRows, comments],
  );

  const overviewStats: OverviewStat[] = useMemo(() => {
    const rank = RANK_CONFIG(stats.avgScore);
    return [
      {
        value: `${stats.attendanceRate}%`,
        label: 'Tỉ lệ chuyên cần',
        sublabel: `${stats.totalSessions} buổi`,
        iconName: 'check-circle',
        iconColor: '#22C55E',
        iconBg: '#ECFDF3',
      },
      {
        value: stats.avgScore != null ? String(stats.avgScore) : '—',
        label: 'Điểm trung bình',
        sublabel: stats.avgScore != null ? '/10' : '',
        iconName: 'clipboard-text',
        iconColor: '#2D7DD2',
        iconBg: '#EEF5FF',
      },
      {
        value: rank.label,
        label: 'Xếp loại học lực',
        sublabel: '',
        iconName: 'star-four-points',
        iconColor: rank.color,
        iconBg: '#F3E8FF',
      },
      {
        value: `${stats.assignmentCompletion}%`,
        label: 'Bài tập hoàn thành',
        sublabel: '',
        iconName: 'trending-up',
        iconColor: '#F59E0B',
        iconBg: '#FFF7ED',
      },
    ];
  }, [stats]);

  const handleCreateComment = () => {
    router.push(
      `/student/evaluation-create?studentId=${id}&studentName=${encodeURIComponent(
        detail?.name ?? '',
      )}&classId=${currentClass?.id ?? ''}` as any,
    );
  };

  const notFound = !id || (!detailQuery.isLoading && (detailQuery.isError || !detail));

  return (
    <View style={styles.container}>
      {notFound ? (
        <>
          <DetailHeader
            student={{
              id: 0,
              name: '',
              studentCode: '',
              birthday: '',
              age: null,
              gender: '',
              className: '',
              email: '',
              phone: '',
              address: '',
              enrolledAt: '',
              note: '',
              parents: [],
            }}
          />
          <View style={[styles.content, { alignItems: 'center', paddingTop: 40, gap: 8 }]}>
            <Icon source="alert-circle-outline" size={32} color="#CBD5E1" />
            <Text style={styles.emptyText}>Không tìm thấy học viên</Text>
          </View>
        </>
      ) : detailQuery.isLoading || !detail ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 80 }} />
      ) : (
        <>
          <DetailHeader
            student={{ ...detail, className: currentClass?.name ?? detail.className }}
            onEdit={() => router.push(`/student/student-create?studentId=${detail.id}` as any)}
          />

          <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

          <ScrollView
            style={styles.scroll}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.content}
          >
            {activeTab === 'overview' && (
              <>
                <OverviewStats stats={overviewStats} />
                <RecentActivities activities={recentActivities} />
                <SkillsProgress
                  skills={[
                    { label: 'Nghe', percent: stats.skills.listening, color: '#22C55E' },
                    { label: 'Nói', percent: stats.skills.speaking, color: '#2D7DD2' },
                    { label: 'Đọc', percent: stats.skills.reading, color: '#7C3AED' },
                    { label: 'Viết', percent: stats.skills.writing, color: '#F59E0B' },
                  ]}
                  onViewDetail={() => setActiveTab('result')}
                />
                <AbsenceSection absenceDates={absenceDates} onViewAll={() => setActiveTab('attendance')} />
              </>
            )}

            {activeTab === 'attendance' && (
              <AttendanceTab
                rows={attendanceRows}
                isLoading={attendanceQuery.isLoading}
                isError={attendanceQuery.isError}
                onRetry={() => attendanceQuery.refetch()}
              />
            )}

            {activeTab === 'homework' && (
              <HomeworkTab
                items={homework}
                isLoading={homeworkQuery.isLoading}
                isError={homeworkQuery.isError}
                onRetry={() => homeworkQuery.refetch()}
                hasClass={!rosterLoading && !!currentClass?.id}
              />
            )}

            {activeTab === 'result' && (
              <ScoresTab
                scores={scores}
                isLoading={evaluationsQuery.isLoading}
                isError={evaluationsQuery.isError}
                onRetry={() => evaluationsQuery.refetch()}
              />
            )}

            {activeTab === 'comment' && (
              <CommentsTab
                comments={comments}
                isLoading={evaluationsQuery.isLoading}
                isError={evaluationsQuery.isError}
                onRetry={() => evaluationsQuery.refetch()}
              />
            )}

            {activeTab === 'info' && <InfoTab student={detail} />}
          </ScrollView>

          <ActionBar onCreateComment={handleCreateComment} />
        </>
      )}
    </View>
  );
}
