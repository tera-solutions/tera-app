import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ExamResultRow } from '../../types';
import { GRADE_LABEL, REGISTRATION_STATUS_LABEL } from '../../constants';
import { styles } from '../../styles';

interface Props {
  rows: ExamResultRow[];
  maxScore: number;
}

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

export default function ResultsTab({ rows, maxScore }: Props) {
  return (
    <View style={styles.tabCard}>
      <Text style={styles.tabCardTitle}>Kết quả học viên ({rows.length})</Text>

      {rows.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Icon source="clipboard-text-off-outline" size={28} color="#CBD5E1" />
          <Text style={styles.emptyText}>Chưa có học viên đăng ký bài kiểm tra này</Text>
        </View>
      ) : (
        rows.map((row) => {
          const gradeCfg = row.grade ? GRADE_LABEL[row.grade] : null;
          return (
            <View key={row.registrationId} style={styles.submissionRow}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initialOf(row.studentName)}</Text>
              </View>
              <View style={styles.submissionInfo}>
                <Text style={styles.submissionName}>{row.studentName || '—'}</Text>
                <Text style={styles.submissionTime}>
                  {row.studentCode ? `${row.studentCode} • ` : ''}
                  {REGISTRATION_STATUS_LABEL[row.registrationStatus]}
                </Text>
              </View>
              {gradeCfg && (
                <View style={[styles.gradeBadge, { backgroundColor: `${gradeCfg.color}1A` }]}>
                  <Text style={[styles.gradeBadgeText, { color: gradeCfg.color }]}>{gradeCfg.label}</Text>
                </View>
              )}
              <View style={styles.submissionScore}>
                {row.totalScore != null ? (
                  <>
                    <Text style={styles.scoreValue}>{row.totalScore}</Text>
                    <Text style={styles.scoreMax}>/{maxScore}</Text>
                  </>
                ) : (
                  <Text style={styles.scoreMax}>Chưa chấm</Text>
                )}
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
