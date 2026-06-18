import { Text, View } from 'react-native';

import { styles } from './style';

function StatItem({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function HomeworkStats() {
  return (
    <View style={styles.summaryCard}>
      <StatItem value="12" label="Tổng bài" />
      <StatItem value="5" label="Chưa làm" />
      <StatItem value="4" label="Đang làm" />
      <StatItem value="3" label="Hoàn thành" />
    </View>
  );
}