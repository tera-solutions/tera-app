import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { CalendarDays } from 'lucide-react-native';

import { styles } from './style';

export interface ScheduleItem {
  id: number;
  startTime: string;
  endTime: string;
  className: string;
  roomName: string;
  branchName: string;
  status: 'upcoming' | 'completed';
}

const schedules: ScheduleItem[] = [
  {
    id: 1,
    startTime: '08:00',
    endTime: '09:30',
    className: 'Starters 2A',
    roomName: 'Phòng 201',
    branchName: 'Cơ sở 1',
    status: 'upcoming',
  },
  {
    id: 2,
    startTime: '09:45',
    endTime: '11:15',
    className: 'Movers 1B',
    roomName: 'Phòng 202',
    branchName: 'Cơ sở 1',
    status: 'upcoming',
  },
  {
    id: 3,
    startTime: '13:30',
    endTime: '15:00',
    className: 'Flyers 3A',
    roomName: 'Phòng 203',
    branchName: 'Cơ sở 1',
    status: 'completed',
  },
];

function ScheduleRow({ item }: { item: ScheduleItem }) {
  return (
    <View style={styles.row}>
      <View style={styles.timeContainer}>
        <Text style={styles.startTime}>{item.startTime}</Text>
        <Text style={styles.endTime}>{item.endTime}</Text>
      </View>

      <View style={styles.divider}>
        <View
          style={[
            styles.dot,
            item.status === 'completed' && styles.completedDot,
          ]}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.className}>{item.className}</Text>

        <Text style={styles.location}>
          {item.roomName} • {item.branchName}
        </Text>
      </View>

      <View>
        <View
          style={[
            styles.statusBadge,
            item.status === 'completed'
              ? styles.completedBadge
              : styles.upcomingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              item.status === 'completed'
                ? styles.completedText
                : styles.upcomingText,
            ]}
          >
            {item.status === 'completed'
              ? 'Đã diễn ra'
              : 'Sắp diễn ra'}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function TodayScheduleCard() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <CalendarDays
            size={22}
            color="#0066cc"
          />

          <Text style={styles.title}>
            Lịch dạy hôm nay
          </Text>
        </View>

        <TouchableOpacity>
          <Text style={styles.viewAll}>
            Xem tất cả
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        scrollEnabled={false}
        data={schedules}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <ScheduleRow item={item} />
        )}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}