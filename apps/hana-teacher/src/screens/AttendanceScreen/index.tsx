import { ActivityIndicator, ScrollView, View } from 'react-native';

import { useAttendanceList } from '@tera/modules/education/attendance';
import { getListData } from '@tera/commons/hooks';

import AttendanceHeader from './components/AttendanceHeader';
import ClassInfoCard from './components/ClassInfoCard';
import AttendanceStats from './components/AttendanceStats';
import AttendanceTabs from './components/AttendanceTabs';
import SearchBar from './components/SearchBar';
import StudentAttendanceList from './components/StudentAttendanceList';
import AttendanceActionBar from './components/AttendanceActionBar';
import RefreshHint from './components/RefreshHint';

import {
  AttendanceResponse,
  AttendanceStats as AttendanceStatsType,
  StudentAttendance,
} from './types';
import { styles } from './style';

// ─── Mapper ──────────────────────────────────────────────────────────────────

function mapToStudentAttendance(
  item: AttendanceResponse,
  index: number,
): StudentAttendance {
  return {
    id: String(item.id),
    no: String(index + 1).padStart(2, '0'),
    avatar: `https://i.pravatar.cc/150?img=${(item.student_id % 50) + 1}`,
    fullName: item.student?.name ?? `Học viên ${item.student_id}`,
    status: (item.status as StudentAttendance['status']) ?? 'unmarked',
    checkInTime: item.checkin_time
      ? item.checkin_time.slice(11, 16)
      : undefined,
  };
}

// ─── Screen ──────────────────────────────────────────────────────────────────

export default function AttendanceScreen() {
  const { data, isLoading, isFetching, refetch } = useAttendanceList({
    params: { per_page: 50 },
  });

  const { items, pagination } = getListData<AttendanceResponse>(data);

  const attendanceList = items.map(mapToStudentAttendance);

  const stats: AttendanceStatsType = {
    total:   pagination.total,
    present: items.filter((i) => i.status === 'present').length,
    late:    items.filter((i) => i.status === 'late').length,
    absent:  items.filter((i) => i.status === 'absent').length,
  };

  const attended = stats.present + stats.late;

  return (
    <View style={styles.container}>
      <AttendanceHeader />
      <ClassInfoCard />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={isFetching}
        onRefresh={refetch}
      >
        <AttendanceStats stats={stats} />

        <AttendanceTabs />

        <SearchBar />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0066cc"
            style={{ marginVertical: 32 }}
          />
        ) : (
          <StudentAttendanceList data={attendanceList} />
        )}

        <AttendanceActionBar attended={attended} total={stats.total} />

        <RefreshHint />
      </ScrollView>
    </View>
  );
}
