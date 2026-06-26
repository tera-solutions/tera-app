import { ScrollView, View } from 'react-native';

import RoomHeader from './components/RoomHeader';
import RoomInfoCard from './components/RoomInfoCard';
import StatsRow from './components/StatsRow';
import TodaySchedule from './components/TodaySchedule';
import StudentsInRoom from './components/StudentsInRoom';
import InClassTools from './components/InClassTools';
import NewNotifications from './components/NewNotifications';
import EnterRoomBtn from './components/EnterRoomBtn';

import {
  IN_CLASS_TOOLS,
  ROOM_INFO,
  ROOM_NOTIFICATIONS,
  STUDENTS_IN_ROOM,
  TODAY_SCHEDULES,
} from './constants';
import { styles } from './styles';

export default function RoomScreen() {
  return (
    <View style={styles.container}>
      <RoomHeader />

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <RoomInfoCard info={ROOM_INFO} />

        <StatsRow info={ROOM_INFO} />

        <TodaySchedule schedules={TODAY_SCHEDULES} />

        <StudentsInRoom
          students={STUDENTS_IN_ROOM}
          total={ROOM_INFO.totalStudents}
        />

        <InClassTools tools={IN_CLASS_TOOLS} />

        <NewNotifications notifications={ROOM_NOTIFICATIONS} />
      </ScrollView>

      <EnterRoomBtn />
    </View>
  );
}
