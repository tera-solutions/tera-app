import { Image, Text, View } from 'react-native';

import { styles } from '../style';
import type { AttendanceRow, AttendanceStats } from '../types';

interface Props {
  stats: AttendanceStats;
  absentRows: AttendanceRow[];
}

const pct = (value: number, total: number) => (total === 0 ? 0 : Math.round((value / total) * 1000) / 10);

const SEGMENTS: { key: keyof AttendanceStats | 'unmarked'; label: string; color: string }[] = [
  { key: 'present', label: 'Có mặt', color: '#22C55E' },
  { key: 'late', label: 'Đi muộn', color: '#F59E0B' },
  { key: 'absent', label: 'Vắng mặt', color: '#EF4444' },
  { key: 'unmarked', label: 'Chưa điểm danh', color: '#94A3B8' },
];

export default function AttendanceReport({ stats, absentRows }: Props) {
  const unmarked = Math.max(stats.total - stats.present - stats.late - stats.absent, 0);
  const valueOf = (key: (typeof SEGMENTS)[number]['key']) => (key === 'unmarked' ? unmarked : stats[key]);

  return (
    <View>
      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Thống kê chi tiết ({stats.total} học viên)</Text>

        {SEGMENTS.map((segment) => {
          const value = valueOf(segment.key);
          const percent = pct(value, stats.total);
          return (
            <View key={segment.key} style={styles.reportRow}>
              <View style={styles.reportRowHeader}>
                <Text style={styles.reportRowLabel}>{segment.label}</Text>
                <Text style={styles.reportRowValue}>
                  {value} ({percent}%)
                </Text>
              </View>
              <View style={styles.reportBarTrack}>
                <View
                  style={[
                    styles.reportBarFill,
                    { width: `${percent}%`, backgroundColor: segment.color },
                  ]}
                />
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.reportCard}>
        <Text style={styles.reportTitle}>Danh sách vắng mặt ({absentRows.length})</Text>
        {absentRows.length === 0 ? (
          <Text style={{ fontSize: 12, color: '#94A3B8' }}>Không có học viên vắng mặt</Text>
        ) : (
          absentRows.map((row) => (
            <View key={row.student_id} style={styles.absentItemRow}>
              {row.avatar ? (
                <Image source={{ uri: row.avatar }} style={styles.absentItemAvatar} />
              ) : (
                <View style={styles.absentItemAvatar} />
              )}
              <Text style={styles.absentItemName} numberOfLines={1}>
                {row.name}
              </Text>
            </View>
          ))
        )}
      </View>
    </View>
  );
}
