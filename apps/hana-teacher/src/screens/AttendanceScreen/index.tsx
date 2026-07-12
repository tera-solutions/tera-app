import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

import { ClassRoomService, ClassSessionService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import AttendanceHeader from './components/AttendanceHeader';
import ClassInfoCard from './components/ClassInfoCard';
import AttendanceStats from './components/AttendanceStats';
import AttendanceTabs from './components/AttendanceTabs';
import SearchBar from './components/SearchBar';
import StudentAttendanceList from './components/StudentAttendanceList';
import AttendanceActionBar from './components/AttendanceActionBar';
import AttendanceReport from './components/AttendanceReport';
import RefreshHint from './components/RefreshHint';

import { useAttendanceSession } from './hooks/useAttendanceSession';
import { getSessionDateRange, sortSessionsByProximity, toClassInfo, toClassSessions } from './_utils';
import type { AttendanceTab, ClassRoomDetailResponse, ClassSessionResponse } from './types';
import { styles } from './style';

export default function AttendanceScreen() {
  const { classId: classIdParam, sessionId: sessionIdParam } = useLocalSearchParams<{
    classId?: string;
    sessionId?: string;
  }>();
  const classId = classIdParam ? Number(classIdParam) : null;

  const [activeTab, setActiveTab] = useState<AttendanceTab>('list');
  const [search, setSearch] = useState('');
  const [sessionId, setSessionId] = useState<number | null>(
    sessionIdParam ? Number(sessionIdParam) : null,
  );

  const classDetailQuery = ClassRoomService.useClassRoomDetail(
    { id: classId ?? '' },
    { enabled: !!classId },
  );
  const classInfo = toClassInfo(classDetailQuery.data as ClassRoomDetailResponse | undefined);

  const { date_from, date_to } = useMemo(getSessionDateRange, []);
  const sessionsQuery = ClassSessionService.useClassSessionList(
    // `ClassSessionAPI.getList` forwards `params` as-is (no `filters` flattening
    // like the other list endpoints), so `date_from`/`date_to` must be top-level.
    { params: { class_id: classId ?? 0, per_page: 100, date_from, date_to } as any },
    { enabled: !!classId },
  );
  // Memoized on `sessionsQuery.data` (not recomputed inline) so `sessions`
  // keeps a stable reference across unrelated re-renders — see the same fix
  // in `useAttendanceSession.ts` for why `getListData(...).items` must never
  // feed a `useEffect`/`useMemo` dependency array unmemoized.
  const sessions = useMemo(() => {
    const { items: rawSessions } = getListData<ClassSessionResponse>(sessionsQuery.data);
    return sortSessionsByProximity(toClassSessions(rawSessions));
  }, [sessionsQuery.data]);

  useEffect(() => {
    if (!sessionId && sessions[0]?.id) setSessionId(sessions[0].id);
  }, [sessions, sessionId]);

  const session = sessions.find((s) => s.id === sessionId);

  const attendance = useAttendanceSession({ classId, sessionId });

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return attendance.rows;
    return attendance.rows.filter(
      (r) => r.name.toLowerCase().includes(term) || r.code.toLowerCase().includes(term),
    );
  }, [attendance.rows, search]);

  const attended = attendance.counts.present + attendance.counts.late;
  const loading = sessionsQuery.isLoading || attendance.loading;

  return (
    <View style={styles.container}>
      <AttendanceHeader />

      <ClassInfoCard
        classInfo={classInfo}
        session={session}
        sessions={sessions}
        onChangeSession={setSessionId}
        loading={classDetailQuery.isLoading}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={attendance.loading}
        onRefresh={attendance.refetch}
      >
        <AttendanceStats stats={attendance.counts} />

        <AttendanceTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {activeTab === 'list' ? (
          <>
            <SearchBar value={search} onChangeText={setSearch} />

            {loading ? (
              <ActivityIndicator size="large" color="#0066cc" style={{ marginVertical: 32 }} />
            ) : (
              <StudentAttendanceList
                data={filteredRows}
                selectedIds={attendance.selectedIds}
                onToggle={attendance.toggleSelect}
              />
            )}

            <AttendanceActionBar
              attended={attended}
              total={attendance.counts.total}
              selectedCount={attendance.selectedIds.size}
              dirtyCount={attendance.dirtyCount}
              saving={attendance.saving}
              onSetStatus={attendance.setStatusForSelected}
              onSave={attendance.save}
              onMarkAllPresent={attendance.markAllPresent}
            />
          </>
        ) : (
          <AttendanceReport stats={attendance.counts} absentRows={attendance.absentRows} />
        )}

        <RefreshHint />
      </ScrollView>
    </View>
  );
}
