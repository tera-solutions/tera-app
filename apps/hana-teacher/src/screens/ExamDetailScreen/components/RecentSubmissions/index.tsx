import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { ExamResultRow } from '../../types';
import { REGISTRATION_STATUS_LABEL } from '../../constants';
import { styles } from '../../styles';

interface Props {
  rows: ExamResultRow[];
  maxScore: number;
  onViewAll?: () => void;
}

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

function scoreColor(score: number, max: number) {
  const pct = max > 0 ? score / max : 0;
  if (pct >= 0.85) return '#22C55E';
  if (pct >= 0.65) return '#F97316';
  return '#EF4444';
}

export default function RecentSubmissions({ rows, maxScore, onViewAll }: Props) {
  if (rows.length === 0) {
    return null;
  }

  return (
    <View style={styles.submissionsCard}>
      <View style={styles.submissionsHeader}>
        <Text style={styles.submissionsTitle}>Học viên</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.submissionsLink}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      {rows.slice(0, 5).map((row) => (
        <View key={row.registrationId} style={styles.submissionRow}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initialOf(row.studentName)}</Text>
          </View>
          <View style={styles.submissionInfo}>
            <Text style={styles.submissionName}>{row.studentName || '—'}</Text>
            <Text style={styles.submissionTime}>
              {REGISTRATION_STATUS_LABEL[row.registrationStatus]}
            </Text>
          </View>
          <View style={styles.submissionScore}>
            {row.totalScore != null ? (
              <>
                <Text style={[styles.scoreValue, { color: scoreColor(row.totalScore, maxScore) }]}>
                  {row.totalScore}
                </Text>
                <Text style={styles.scoreMax}>/{maxScore}</Text>
              </>
            ) : (
              <Text style={styles.scoreMax}>Chưa chấm</Text>
            )}
          </View>
          <ChevronRight size={16} color="#CBD5E1" />
        </View>
      ))}
    </View>
  );
}
