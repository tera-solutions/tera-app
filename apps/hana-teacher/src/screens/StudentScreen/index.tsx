import { useState, useMemo } from 'react';
import { ActivityIndicator, ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useStudentList } from '@tera/modules/education/student';
import { getListData } from '@tera/commons/hooks';

import StudentHeader from './components/StudentHeader';
import ClassInfoCard from './components/ClassInfoCard';
import StatsRow from './components/StatsRow';
import StudentTabs from './components/StudentTabs';
import StudentSearchBar from './components/StudentSearchBar';
import StudentItem from './components/StudentItem';
import QuickAttendanceBanner from './components/QuickAttendanceBanner';

import {
  StudentTab,
  StudentItem as StudentItemType,
  StudentResponse,
  StudentApiStatus,
  StudentTag,
} from './types';
import { CLASS_INFO } from './constants';
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
  const [activeTab, setActiveTab] = useState<StudentTab>('list');
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useStudentList({
    params: { search: search || undefined, per_page: 50 },
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
        <ClassInfoCard info={CLASS_INFO} />

        <StatsRow info={CLASS_INFO} totalStudents={pagination.total} />

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

        <QuickAttendanceBanner classId={CLASS_INFO.id} />
      </ScrollView>
    </View>
  );
}
