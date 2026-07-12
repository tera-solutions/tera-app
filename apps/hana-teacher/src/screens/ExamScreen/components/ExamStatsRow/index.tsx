import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ExamStats } from '../../types';
import { styles } from '../../styles';

interface Props {
  stats: ExamStats;
}

export default function ExamStatsRow({ stats }: Props) {
  const ITEMS = [
    { value: stats.total, label: 'Tổng bài kiểm tra', iconName: 'file-document-outline', iconBg: '#EEF5FF', iconColor: '#2196F3' },
    { value: stats.scheduled, label: 'Đã lên lịch', iconName: 'calendar-outline', iconBg: '#FFF7ED', iconColor: '#F59E0B' },
    { value: stats.in_progress, label: 'Đang diễn ra', iconName: 'clock-outline', iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
    { value: stats.closed, label: 'Đã đóng', iconName: 'check-circle-outline', iconBg: '#F0FDF4', iconColor: '#22C55E' },
  ];

  return (
    <View style={styles.statsCard}>
      <View style={styles.statsRow}>
        {ITEMS.map((item, i) => (
          <View key={item.label} style={[styles.statBox, i > 0 && styles.statBoxBorder]}>
            <View style={[styles.statIconWrapper, { backgroundColor: item.iconBg }]}>
              <Icon source={item.iconName} size={22} color={item.iconColor} />
            </View>
            <Text style={[styles.statValue, { color: item.iconColor }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
