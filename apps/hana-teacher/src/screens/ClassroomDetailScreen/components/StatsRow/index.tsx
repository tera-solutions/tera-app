import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ClassDetail } from '../../types';
import { styles } from '../../styles';

interface Props {
  detail: ClassDetail;
}

const STATS = (detail: ClassDetail) => [
  { value: detail.totalStudents, label: 'Học viên', iconName: 'account-group-outline', iconColor: '#2196F3' },
  { value: detail.attendanceCount, label: 'Điểm danh', iconName: 'check-circle-outline', iconColor: '#22C55E' },
  { value: detail.lessonCount, label: 'Bài học', iconName: 'book-open-outline', iconColor: '#F97316' },
  { value: detail.homeworkCount, label: 'Bài tập', iconName: 'clipboard-list-outline', iconColor: '#8B5CF6' },
];

export default function StatsRow({ detail }: Props) {
  const stats = STATS(detail);
  return (
    <View style={styles.statsRow}>
      {stats.map((s, i) => (
        <View key={s.label} style={[styles.statBox, i > 0 && styles.statBoxBorder]}>
          <Icon source={s.iconName} size={22} color={s.iconColor} />
          <Text style={styles.statValue}>{s.value}</Text>
          <Text style={styles.statLabel}>{s.label}</Text>
        </View>
      ))}
    </View>
  );
}
