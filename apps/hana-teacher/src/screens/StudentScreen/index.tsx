import { useState, useMemo } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useStudentList } from '@tera/modules/education/student';
import { ClassRoomService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import StudentHeader from './components/StudentHeader';
import ClassInfoCard from './components/ClassInfoCard';
import StudentTabs from './components/StudentTabs';
import StudentSearchBar from './components/StudentSearchBar';
import StudentItem from './components/StudentItem';
import QuickAttendanceBanner from './components/QuickAttendanceBanner';
import EnrollFAB from './components/EnrollFAB';

import {
  StudentTab,
  StudentItem as StudentItemType,
  StudentResponse,
  StudentApiStatus,
  StudentTag,
  ClassInfo,
} from './types';
import { styles } from './styles';

// ─── Avatar pool ─────────────────────────────────────────────────────────────
const AVATARS = [
  require('@tera/assets/app/element_85.png'),
  require('@tera/assets/app/element_86.png'),
  require('@tera/assets/app/element_87.png'),
  require('@tera/assets/app/element_88.png'),
  require('@tera/assets/app/element_89.png'),
  require('@tera/assets/app/element_90.png'),
];

// ─── Tag config ───────────────────────────────────────────────────────────────
const TAG_MAP: Record<
  StudentApiStatus,
  { tag: StudentTag; tagColor: string; tagTextColor: string }
> = {
  active:    { tag: 'Tích cực',     tagColor: '#EEF5FF', tagTextColor: '#2D7DD2' },
  suspended: { tag: 'Cần cố gắng', tagColor: '#FFF7E6', tagTextColor: '#D97706' },
  inactive:  { tag: 'Bình thường', tagColor: '#F1F5F9', tagTextColor: '#64748B' },
};

// ─── Date formatter ───────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────
function mapToStudentItem(item: StudentResponse, index: number): StudentItemType {
  const status = item.status ?? 'active';
  const tagConfig = TAG_MAP[status] ?? TAG_MAP.active;

  return {
    id: String(item.id),
    index: index + 1,
    name: item.name,
    birthday: item.dob ? formatDate(item.dob) : 'Chưa cập nhật',
    gender: 'Nam',                        // API trả null, dùng default
    rating: 4.5,                          // không có trong list API
    tag: tagConfig.tag,
    tagColor: tagConfig.tagColor,
    tagTextColor: tagConfig.tagTextColor,
    status: status === 'active' ? 'present' : 'absent',
    attendanceRate: 0,                    // không có trong list API
    avatar: AVATARS[index % AVATARS.length],
  };
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function StudentScreen() {
  const router = useRouter();
  const { classId } = useLocalSearchParams<{ classId?: string }>();
  const hasClass = !!classId;

  const [activeTab, setActiveTab] = useState<StudentTab>('list');
  const [search, setSearch] = useState('');

  const classDetailQuery = ClassRoomService.useClassRoomDetail(
    { id: classId ?? '' },
    { enabled: hasClass },
  );
  const classRaw = classDetailQuery.data?.data?.class ?? classDetailQuery.data?.data;

  const { data, isLoading, isFetching, refetch } = useStudentList({
    params: {
      search: search || undefined,
      per_page: 50,
      filters: hasClass ? { class_id: Number(classId) } : undefined,
    },
  });

  const { items, pagination } = getListData<StudentResponse>(data);

  const studentList = useMemo(() => items.map(mapToStudentItem), [items]);

  const filteredStudents = useMemo(() => {
    if (activeTab === 'absent') {
      return studentList.filter((s) => s.status === 'absent');
    }
    return studentList;
  }, [activeTab, studentList]);

  const absentCount = studentList.filter((s) => s.status === 'absent').length;

  // Không có endpoint chi tiết điểm danh/ngày hôm nay theo lớp, nên chỉ hiển
  // thị các thông tin tĩnh của lớp thật, không bịa số liệu "Đi học/Vắng học".
  const classInfo: ClassInfo | null =
    hasClass && classRaw
      ? {
          id: String(classRaw.id ?? classId),
          name: classRaw.name ?? '',
          ageGroup: '',
          level: classRaw.course?.name ?? '',
          room: classRaw.room?.name ?? '',
          branch: classRaw.branch?.name ?? '',
          image: require('@tera/assets/app/element_84.png'),
          color: '#0B84FF',
          totalStudents: pagination.total,
          presentCount: 0,
          absentCount: 0,
          attendanceRate: 0,
        }
      : null;

  const handlePressStudent = (item: StudentItemType) => {
    router.push(`/student/student-detail?studentId=${item.id}`);
  };

  return (
    <View style={styles.container}>
      <StudentHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshing={isFetching}
        onRefresh={refetch}
      >
        {classInfo && <ClassInfoCard info={classInfo} />}

        <StudentTabs
          activeTab={activeTab}
          totalCount={pagination.total}
          absentCount={absentCount}
          onTabChange={setActiveTab}
        />

        <StudentSearchBar value={search} onChangeText={setSearch} />

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color="#0066CC"
            style={{ marginVertical: 32 }}
          />
        ) : (
          filteredStudents.map((student) => (
            <StudentItem
              key={student.id}
              item={student}
              onPress={handlePressStudent}
            />
          ))
        )}

        {hasClass && <QuickAttendanceBanner classId={classId} />}
      </ScrollView>

      {hasClass ? (
        <EnrollFAB
          label="Ghi danh"
          onPress={() => router.push(`/student/enrollment?classId=${classId}`)}
        />
      ) : (
        <EnrollFAB
          label="Tạo mới"
          onPress={() => router.push('/student/student-create')}
        />
      )}
    </View>
  );
}
