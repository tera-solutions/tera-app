import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ExamScoreSummary } from '../../types';
import { styles } from '../../styles';

interface Props {
  summary: ExamScoreSummary;
}

export default function ScoreSummarySection({ summary }: Props) {
  const ITEMS = [
    { label: 'Tổng điểm', value: summary.totalScore, unit: 'điểm', iconName: 'star-outline', iconColor: '#8B5CF6' },
    { label: 'Điểm đạt', value: summary.passingScore, unit: 'điểm', iconName: 'check-decagram-outline', iconColor: '#22C55E' },
    { label: 'Điểm cao nhất', value: summary.maxScore || '—', unit: '', iconName: 'trending-up', iconColor: '#2196F3' },
    { label: 'Điểm thấp nhất', value: summary.minScore || '—', unit: '', iconName: 'trending-down', iconColor: '#F97316' },
  ];

  return (
    <View style={styles.qbCard}>
      <Text style={styles.qbTitle}>Thống kê điểm số</Text>
      <View style={styles.qbRow}>
        {ITEMS.map((item, i) => (
          <View key={item.label} style={[styles.qbItem, i > 0 && styles.qbItemBorder]}>
            <Icon source={item.iconName} size={16} color={item.iconColor} />
            <Text style={styles.qbLabel}>{item.label}</Text>
            <Text style={styles.qbValue}>{item.value}</Text>
            {!!item.unit && <Text style={styles.qbUnit}>{item.unit}</Text>}
          </View>
        ))}
      </View>
    </View>
  );
}
