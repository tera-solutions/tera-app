import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ExamDetailStats } from '../../types';
import { styles } from '../../styles';

interface Props {
  stats: ExamDetailStats;
}

export default function ExamStatsRow({ stats }: Props) {
  const CARDS = [
    {
      value: stats.totalStudents,
      label: 'Tổng số học viên',
      sub: null,
      iconName: 'account-group-outline',
      iconColor: '#2196F3',
      bg: '#EEF5FF',
      valueColor: '#2196F3',
    },
    {
      value: stats.submitted,
      label: 'Đã nộp bài',
      sub: `${stats.submittedPercent}%`,
      iconName: 'check-circle-outline',
      iconColor: '#22C55E',
      bg: '#F0FDF4',
      valueColor: '#22C55E',
    },
    {
      value: stats.pending,
      label: 'Chưa nộp bài',
      sub: `${stats.pendingPercent}%`,
      iconName: 'clock-outline',
      iconColor: '#F97316',
      bg: '#FFF7ED',
      valueColor: '#F97316',
    },
    {
      value: stats.avgScore,
      label: 'Điểm trung bình',
      sub: '/10',
      iconName: 'chart-bar',
      iconColor: '#8B5CF6',
      bg: '#F5F3FF',
      valueColor: '#8B5CF6',
    },
  ];

  return (
    <View style={styles.statsGrid}>
      {CARDS.map((card) => (
        <View key={card.label} style={[styles.statCard, { backgroundColor: card.bg }]}>
          <Icon source={card.iconName} size={22} color={card.iconColor} />
          <Text style={[styles.statValue, { color: card.valueColor }]}>
            {card.value}
          </Text>
          <Text style={styles.statLabel}>{card.label}</Text>
          {card.sub && (
            <Text style={[styles.statSub, { color: card.iconColor }]}>{card.sub}</Text>
          )}
        </View>
      ))}
    </View>
  );
}
