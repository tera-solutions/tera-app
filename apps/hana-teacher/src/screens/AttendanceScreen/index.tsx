import { ScrollView, View } from 'react-native';

import AttendanceHeader from './components/AttendanceHeader';
import ClassInfoCard from './components/ClassInfoCard';
import AttendanceStats from './components/AttendanceStats';
import AttendanceTabs from './components/AttendanceTabs';
import SearchBar from './components/SearchBar';
import StudentAttendanceList from './components/StudentAttendanceList';
import AttendanceActionBar from './components/AttendanceActionBar';
import RefreshHint from './components/RefreshHint';

import { ATTENDANCE_DATA } from './constants';
import { styles } from './style';

export default function AttendanceScreen() {
  return (
    <View style={styles.container}>
      <AttendanceHeader />
      <ClassInfoCard />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <AttendanceStats />

        <AttendanceTabs />

        <SearchBar />

        <StudentAttendanceList data={ATTENDANCE_DATA} />

        <AttendanceActionBar />

        <RefreshHint />
      </ScrollView>
    </View>
  );
}
