import { Image, Text, TouchableOpacity, View } from 'react-native';

import {
  CheckCircle2,
  Clock3,
  MoreVertical,
  XCircle,
} from 'lucide-react-native';

import { styles } from '../style';

export default function StudentAttendanceItem({ item }: any) {
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
    }
  };

  return (
    <View style={styles.studentCard}>
      <View style={styles.no}>
        <Text style={styles.noText}>{item.no}</Text>
      </View>

      <Image source={{ uri: item.avatar }} style={styles.studentAvatar} />

      <Text style={styles.studentName}>{item.fullName}</Text>

      {renderStatus()}

      <Text style={styles.time}>{item.checkInTime}</Text>

      <TouchableOpacity>
        <MoreVertical color="#94A3B8" size={20} />
      </TouchableOpacity>
    </View>
  );
}
