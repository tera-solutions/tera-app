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
    { value: stats.completed, label: 'Đã hoàn thành', iconName: 'check-circle-outline', iconBg: '#F0FDF4', iconColor: '#22C55E' },
    { value: stats.ongoing, label: 'Đang diễn ra', iconName: 'clock-outline', iconBg: '#FFF7ED', iconColor: '#F59E0B' },
    { value: stats.upcoming, label: 'Chưa bắt đầu', iconName: 'calendar-outline', iconBg: '#FFF1F2', iconColor: '#EF4444' },
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
