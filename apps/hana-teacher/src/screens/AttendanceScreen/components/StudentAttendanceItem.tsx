import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Check, CheckCircle2, Clock3, XCircle } from 'lucide-react-native';

import { styles } from '../style';
import type { AttendanceRow } from '../types';

interface Props {
  item: AttendanceRow;
  index: number;
  selected: boolean;
  onToggle: (studentId: number) => void;
}

export default function StudentAttendanceItem({ item, index, selected, onToggle }: Props) {
  const renderStatus = () => {
    switch (item.status) {
      case 'present':
        return (
          <View style={styles.presentBadge}>
            <CheckCircle2 size={16} color="#22C55E" />
            <Text style={styles.presentText}>Có mặt</Text>
          </View>
        );
      case 'late':
        return (
          <View style={styles.lateBadge}>
            <Clock3 size={16} color="#F59E0B" />
            <Text style={styles.lateText}>Đi muộn</Text>
          </View>
        );
      case 'absent':
        return (
          <View style={styles.absentBadge}>
            <XCircle size={16} color="#EF4444" />
            <Text style={styles.absentText}>Vắng mặt</Text>
          </View>
        );
      default:
        return (
          <View style={styles.unmarkedBadge}>
            <Text style={styles.unmarkedText}>Chưa điểm danh</Text>
          </View>
        );
    }
  };

  return (
    <TouchableOpacity
      style={[styles.studentCard, selected && styles.studentCardSelected]}
      onPress={() => onToggle(item.student_id)}
      activeOpacity={0.7}
    >
      <View style={styles.no}>
        {selected ? <Check size={16} color="#007AFF" /> : <Text style={styles.noText}>{index + 1}</Text>}
      </View>

      {item.avatar ? (
        <Image source={{ uri: item.avatar }} style={styles.studentAvatar} />
      ) : (
        <View style={[styles.studentAvatar, { backgroundColor: '#EEF5FF' }]} />
      )}

      <Text style={styles.studentName} numberOfLines={1}>
        {item.name}
      </Text>

      {renderStatus()}
    </TouchableOpacity>
  );
}
