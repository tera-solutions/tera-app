import { useState, useMemo } from 'react';
import { ScrollView, View } from 'react-native';
import { useRouter } from 'expo-router';

import StudentHeader from './components/StudentHeader';
import ClassInfoCard from './components/ClassInfoCard';
import StatsRow from './components/StatsRow';
import StudentTabs from './components/StudentTabs';
import StudentSearchBar from './components/StudentSearchBar';
import StudentItem from './components/StudentItem';
import QuickAttendanceBanner from './components/QuickAttendanceBanner';

import { StudentTab, StudentItem as StudentItemType } from './types';
import { CLASS_INFO, STUDENTS } from './constants';
import { styles } from './styles';

export default function StudentScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<StudentTab>('list');
  const [search, setSearch] = useState('');

  const filteredStudents = useMemo(() => {
    let list = activeTab === 'absent'
      ? STUDENTS.filter((s) => s.status === 'absent')
      : STUDENTS;

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((s) => s.name.toLowerCase().includes(q));
    }

    return list;
  }, [activeTab, search]);

  const absentCount = STUDENTS.filter((s) => s.status === 'absent').length;

  const handlePressStudent = (item: StudentItemType) => {
    router.push(`/student/student-detail?studentId=${item.id}`);
  };

  return (
    <View style={styles.container}>
      <StudentHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <ClassInfoCard info={CLASS_INFO} />

        <StatsRow info={CLASS_INFO} />

        <StudentTabs
          activeTab={activeTab}
          totalCount={CLASS_INFO.totalStudents}
          absentCount={absentCount}
          onTabChange={setActiveTab}
        />

        <StudentSearchBar value={search} onChangeText={setSearch} />

        {filteredStudents.map((student) => (
          <StudentItem
            key={student.id}
            item={student}
            onPress={handlePressStudent}
          />
        ))}

        <QuickAttendanceBanner classId={CLASS_INFO.id} />
      </ScrollView>
    </View>
  );
}
