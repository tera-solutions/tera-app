import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { ClassProgress } from '../../types';
import { styles } from '../../styles';

interface Props {
  progress: ClassProgress;
}

export default function ProgressCard({ progress }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.progressHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon source="chart-bar" size={18} color="#0066CC" />
          <Text style={styles.sectionTitle}>Tiến độ lớp học</Text>
        </View>
        <Text style={[styles.sectionLink, { fontSize: 16, fontWeight: '800' }]}>
          {progress.percent}%
        </Text>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress.percent}%` }]} />
      </View>

      <View style={styles.progressFooter}>
        <Text style={styles.progressCaption}>
          Đã hoàn thành {progress.completed}/{progress.total} bài học
        </Text>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.sectionLink}>Xem chi tiết</Text>
          <ChevronRight size={14} color="#0066CC" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
