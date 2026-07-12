import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { CheckCircle2, Clock3, Users, XCircle } from 'lucide-react-native';

import { styles } from '../style';
import { STATUS_ACTIONS } from '../constants';
import type { AttendanceApiStatus } from '../types';

interface Props {
  attended?: number;
  total?: number;
  selectedCount?: number;
  dirtyCount?: number;
  saving?: boolean;
  onSetStatus: (status: AttendanceApiStatus) => void;
  onSave: () => void;
  onMarkAllPresent: () => void;
}

const STATUS_ICON: Record<AttendanceApiStatus, React.ReactNode> = {
  present: <CheckCircle2 color="#fff" />,
  late: <Clock3 color="#fff" />,
  absent: <XCircle color="#fff" />,
  excused: <CheckCircle2 color="#fff" />,
};

const STATUS_BTN_STYLE: Record<AttendanceApiStatus, any> = {
  present: styles.presentBtn,
  late: styles.lateBtn,
  absent: styles.absentBtn,
  excused: styles.presentBtn,
};

export default function AttendanceActionBar({
  attended = 0,
  total = 0,
  selectedCount = 0,
  dirtyCount = 0,
  saving = false,
  onSetStatus,
  onSave,
  onMarkAllPresent,
}: Props) {
  return (
    <View>
      <View style={styles.actionBar}>
        <View style={styles.summaryBox}>
          <Users color="#0066cc" size={32} />
          <Text style={styles.summaryText}>Đã điểm danh</Text>
          <View style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
            <Text style={[styles.summaryText, { color: '#0066cc', fontSize: 20, fontWeight: '700' }]}>
              {attended}
            </Text>
            <Text style={[styles.summaryText, { color: '#0066cc', fontSize: 12 }]}>/{total}</Text>
          </View>
        </View>

        {STATUS_ACTIONS.map((action) => (
          <TouchableOpacity
            key={action.status}
            style={[STATUS_BTN_STYLE[action.status], selectedCount === 0 && styles.actionBtnDisabled]}
            disabled={selectedCount === 0 || saving}
            onPress={() => onSetStatus(action.status)}
          >
            {STATUS_ICON[action.status]}
            <Text style={styles.actionText}>{action.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.selectHint}>
        {selectedCount > 0 ? `Đã chọn ${selectedCount} học viên` : 'Chọn học viên để điểm danh'}
      </Text>

      <View style={styles.saveRow}>
        <TouchableOpacity style={styles.markAllBtn} disabled={saving} onPress={onMarkAllPresent}>
          <Text style={styles.markAllText}>Đánh dấu có mặt tất cả</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.saveBtn, (dirtyCount === 0 || saving) && styles.actionBtnDisabled]}
          disabled={dirtyCount === 0 || saving}
          onPress={onSave}
        >
          {saving ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.saveBtnText}>
              {dirtyCount > 0 ? `Lưu điểm danh (${dirtyCount})` : 'Lưu điểm danh'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
