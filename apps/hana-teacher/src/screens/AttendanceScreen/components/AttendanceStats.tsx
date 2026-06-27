import { Text, View } from 'react-native';
import { CheckCircle2, Clock3, Users, XCircle } from 'lucide-react-native';

import { AttendanceStats } from '../types';
import { styles } from '../style';

interface Props {
  stats?: AttendanceStats;
}

export default function AttendanceStatsComponent({ stats }: Props) {
  const attended = (stats?.present ?? 0) + (stats?.late ?? 0);
  const pending = (stats?.total ?? 0) - attended - (stats?.absent ?? 0);

  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Users color="#0066cc" />
        <View>
          <Text style={[styles.statValue, { color: '#0066cc' }]}>
            {stats?.total ?? 0}
          </Text>
          <Text style={styles.statLabel}>Tổng số</Text>
        </View>
      </View>

      <View style={styles.statCard}>
        <CheckCircle2 color="#22C55E" />
        <View>
          <Text style={[styles.statValue, { color: '#22C55E' }]}>
            {attended}
          </Text>
          <Text style={styles.statLabel}>Đã điểm danh</Text>
        </View>
      </View>

      <View style={styles.statCard}>
        <XCircle color="#EF4444" />
        <View>
          <Text style={[styles.statValue, { color: '#EF4444' }]}>
            {stats?.absent ?? 0}
          </Text>
          <Text style={styles.statLabel}>Vắng mặt</Text>
        </View>
      </View>
    </View>
  );
}
