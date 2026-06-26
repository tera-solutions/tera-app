import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { RoomInfo } from '../../types';
import { styles } from '../../styles';

interface Props {
  info: RoomInfo;
}

export default function StatsRow({ info }: Props) {
  const STATS = [
    { label: 'Học viên', value: String(info.totalStudents), iconName: 'account-group-outline', iconColor: '#2196F3' },
    { label: 'Điểm danh', value: info.attendanceDisplay, iconName: 'check-circle-outline', iconColor: '#22C55E' },
    { label: 'Bài học', value: String(info.lessonCount), iconName: 'book-open-outline', iconColor: '#F97316' },
    { label: 'Lịch học', value: String(info.scheduleCount), iconName: 'calendar-outline', iconColor: '#8B5CF6' },
  ];

  return (
    <View style={styles.statsRow}>
      {STATS.map((s, i) => (
        <View key={s.label} style={[styles.statBox, i > 0 && styles.statBoxBorder]}>
          <Icon source={s.iconName} size={24} color={s.iconColor} />
          <Text style={styles.statLabel}>{s.label}</Text>
          <Text style={styles.statValue}>{s.value}</Text>
        </View>
      ))}
    </View>
  );
}
