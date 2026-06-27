import { useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { useClassRoomDetail } from '@tera/modules/education/class-room';

import ClassDetailHeader from './components/ClassDetailHeader';
import ClassInfoCard from './components/ClassInfoCard';
import StatsRow from './components/StatsRow';
import QuickActions from './components/QuickActions';
import DetailTabs from './components/DetailTabs';
import AttendanceCard from './components/AttendanceCard';
import NextLessonCard from './components/NextLessonCard';
import ProgressCard from './components/ProgressCard';
import AnnouncementsCard from './components/AnnouncementsCard';

import {
  ClassDetail,
  ClassDetailTab,
  AttendanceSummary,
  ClassProgress,
  ClassRoomDetailResponse,
} from './types';
import { ANNOUNCEMENTS, NEXT_LESSON, DETAIL_TABS } from './constants';
import { styles } from './styles';

// ── Weekday label map ──────────────────────────────────────────
const WEEKDAY_LABELS: Record<number, string> = {
  2: 'T2', 3: 'T3', 4: 'T4', 5: 'T5', 6: 'T6', 7: 'T7', 8: 'CN',
};

const LEARNING_TYPE_LABELS: Record<string, string> = {
  self_learning: 'Tự học',
  offline: 'Trực tiếp',
  online: 'Trực tuyến',
};

const CLASS_IMAGE = require('@tera/assets/app/element_94.png');

// ── Mappers ────────────────────────────────────────────────────
function mapToClassDetail(response: ClassRoomDetailResponse): ClassDetail {
  const cls = response.data?.class;
  const stats = response.data?.statistics;

  const schedules = cls?.schedules ?? [];
  const weekdayText = schedules
    .map((s) => WEEKDAY_LABELS[s.weekday ?? 0])
    .filter(Boolean)
    .join(', ');
  const firstSchedule = schedules[0];
  const timeText = firstSchedule
    ? `${firstSchedule.start_time?.slice(0, 5)} - ${firstSchedule.end_time?.slice(0, 5)}`
    : '';
  const scheduleText = weekdayText && timeText ? `${weekdayText} • ${timeText}` : weekdayText || timeText;

  return {
    id: String(cls?.id ?? ''),
    name: cls?.name ?? '',
    subject: cls?.course?.name ?? '',
    level: LEARNING_TYPE_LABELS[cls?.learning_type ?? ''] ?? cls?.learning_type ?? '',
    schedule: scheduleText,
    room: (cls?.room as { name?: string } | null)?.name ?? 'Chưa xếp phòng',
    image: CLASS_IMAGE,
    color: '#0B84FF',
    isActive: cls?.status === 'active',
    totalStudents: stats?.students?.total ?? 0,
    attendanceCount: stats?.students?.active ?? 0,
    lessonCount: stats?.operational?.total_sessions ?? 0,
    homeworkCount: 0,
  };
}

function mapToAttendanceSummary(response: ClassRoomDetailResponse): AttendanceSummary {
  const s = response.data?.statistics?.students;
  return {
    present: s?.active ?? 0,
    absent: s?.dropped ?? 0,
    excused: s?.reserved ?? 0,
    total: s?.total ?? 0,
  };
}

function mapToClassProgress(response: ClassRoomDetailResponse): ClassProgress {
  const op = response.data?.statistics?.operational;
  return {
    completed: op?.completed_sessions ?? 0,
    total: op?.total_sessions ?? 0,
    percent: Math.round(op?.completion_rate ?? 0),
  };
}

// ── Screen ─────────────────────────────────────────────────────
export default function ClassroomDetailScreen() {
  const { classId } = useLocalSearchParams<{ classId: string }>();
  const [activeTab, setActiveTab] = useState<ClassDetailTab>('overview');

  const { data, isLoading } = useClassRoomDetail({ id: classId ?? '' });

  const response = data as ClassRoomDetailResponse | undefined;
  const detail = response ? mapToClassDetail(response) : null;
  const attendanceSummary = response ? mapToAttendanceSummary(response) : null;
  const classProgress = response ? mapToClassProgress(response) : null;

  return (
    <View style={styles.container}>
      <ClassDetailHeader title={detail?.name} />

      <DetailTabs activeTab={activeTab} onTabChange={setActiveTab} />

      {isLoading || !detail ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 48 }} />
      ) : (
        <ScrollView
          style={styles.scroll}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
        >
          <ClassInfoCard detail={detail} />

          <StatsRow detail={detail} />

          <QuickActions />

          {activeTab === 'overview' && (
            <>
              {attendanceSummary && (
                <AttendanceCard summary={attendanceSummary} />
              )}

              <NextLessonCard lesson={NEXT_LESSON} />

              {classProgress && (
                <ProgressCard progress={classProgress} />
              )}

              <AnnouncementsCard announcements={ANNOUNCEMENTS} />
            </>
          )}
        </ScrollView>
      )}
    </View>
  );
}
