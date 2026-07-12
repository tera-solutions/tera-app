import { Text, TouchableOpacity, View } from 'react-native';

import { styles } from '../../styles';

interface Props {
  percent: number;
  updatedAt: string;
}

export default function ProgressSection({ percent, updatedAt }: Props) {
  return (
    <View style={styles.progressCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.progressTitle}>Tiến độ làm bài</Text>
        <TouchableOpacity>
          <Text style={styles.progressLink}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${percent}%` }]} />
      </View>

      <View style={styles.progressFooter}>
        <Text style={styles.progressCaption}>
          {percent}% học viên đã nộp bài
        </Text>
        <Text style={styles.progressUpdated}>Ngày thi: {updatedAt}</Text>
      </View>
    </View>
  );
}
