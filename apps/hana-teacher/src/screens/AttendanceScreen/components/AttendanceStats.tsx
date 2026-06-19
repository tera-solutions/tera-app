import { Text, View } from 'react-native';
import { CheckCircle2, Clock3, Users } from 'lucide-react-native';

import { styles } from '../style';

export default function AttendanceStats() {
  return (
    <View style={styles.statsRow}>
      <View style={styles.statCard}>
        <Users color="#0066cc" />
        <View>
          <Text style={[styles.statValue, { color: '#0066cc' }]}>22</Text>
          <Text style={styles.statLabel}>Tổng số</Text>
        </View>
      </View>

      <View style={styles.statCard}>
        <CheckCircle2 color="#22C55E" />
        <View>
          <Text style={[styles.statValue, { color: '#22C55E' }]}>18</Text>
          <Text style={styles.statLabel}>Đã điểm danh</Text>
        </View>
      </View>

      <View style={styles.statCard}>
        <Clock3 color="#F59E0B" />
        <View>
          <Text style={[styles.statValue, { color: '#F59E0B' }]}>4</Text>
          <Text style={styles.statLabel}>Chưa điểm danh</Text>
        </View>
      </View>
    </View>
  );
}
