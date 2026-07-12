import { Text, View } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';

import { AttendanceRow } from '../../types';
import { ATTENDANCE_STATUS_LABEL } from '../../constants';
import { styles } from '../../styles';

interface Props {
  rows: AttendanceRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export default function AttendanceTab({ rows, isLoading, isError, onRetry }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="calendar-check-outline" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Lịch sử điểm danh</Text>
        </View>
      </View>

      {isError ? (
        <View style={styles.emptyWrapper}>
          <Icon source="alert-circle-outline" size={26} color="#E74C3C" />
          <Text style={styles.emptyText}>Không tải được lịch sử điểm danh</Text>
          <Text style={styles.retryText} onPress={onRetry}>
            Thử lại
          </Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator style={{ paddingVertical: 20 }} />
      ) : rows.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Text style={styles.emptyText}>Chưa có dữ liệu điểm danh</Text>
        </View>
      ) : (
        rows.map((row) => {
          const cfg = ATTENDANCE_STATUS_LABEL[row.status] ?? {
            label: row.status || '—',
            color: '#64748B',
            bg: '#F1F5F9',
          };
          return (
            <View key={row.id} style={styles.listRow}>
              <View style={styles.listRowBody}>
                <Text style={styles.listRowTitle} numberOfLines={1}>
                  {row.sessionName || 'Buổi học'}
                </Text>
                <Text style={styles.listRowSubtitle}>{row.sessionDate}</Text>
              </View>
              <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                <Text style={[styles.statusBadgeText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
