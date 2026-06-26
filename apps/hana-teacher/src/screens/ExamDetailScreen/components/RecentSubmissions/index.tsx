import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { SubmissionItem } from '../../types';
import { styles } from '../../styles';

interface Props {
  submissions: SubmissionItem[];
  onViewAll?: () => void;
}

function scoreColor(score: number, max: number) {
  const pct = score / max;
  if (pct >= 0.85) return '#22C55E';
  if (pct >= 0.65) return '#F97316';
  return '#EF4444';
}

export default function RecentSubmissions({ submissions, onViewAll }: Props) {
  return (
    <View style={styles.submissionsCard}>
      <View style={styles.submissionsHeader}>
        <Text style={styles.submissionsTitle}>Học viên nộp bài gần đây</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.submissionsLink}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {submissions.map((item) => (
        <TouchableOpacity key={item.id} style={styles.submissionRow}>
          <Image
            source={item.avatar}
            style={styles.avatar}
            resizeMode="cover"
          />
          <View style={styles.submissionInfo}>
            <Text style={styles.submissionName}>{item.name}</Text>
            <Text style={styles.submissionTime}>Nộp lúc: {item.submittedAt}</Text>
          </View>
          <View style={styles.submissionScore}>
            <Text style={[styles.scoreValue, { color: scoreColor(item.score, item.maxScore) }]}>
              {item.score}
            </Text>
            <Text style={styles.scoreMax}>/{item.maxScore}</Text>
          </View>
          <ChevronRight size={16} color="#CBD5E1" />
        </TouchableOpacity>
      ))}
    </View>
  );
}
