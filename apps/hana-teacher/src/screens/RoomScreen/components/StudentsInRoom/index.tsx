import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { StudentInRoom, AttendanceStatus } from '../../types';
import { styles } from '../../styles';

interface Props {
  students: StudentInRoom[];
  total: number;
  onViewAll?: () => void;
}

const STATUS_LABEL: Record<AttendanceStatus, string> = {
  checked_in: 'Đã điểm danh',
  present: 'Có mặt',
  absent: 'Vắng',
};

const STATUS_COLOR: Record<AttendanceStatus, string> = {
  checked_in: '#16A34A',
  present: '#2196F3',
  absent: '#F97316',
};

const DOT_COLOR: Record<AttendanceStatus, string> = {
  checked_in: '#22C55E',
  present: '#2196F3',
  absent: '#F97316',
};

export default function StudentsInRoom({ students, total, onViewAll }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Học viên trong phòng ({total})</Text>
        <TouchableOpacity style={styles.sectionLink} onPress={onViewAll}>
          <Text style={styles.sectionLinkText}>Xem tất cả</Text>
          <ChevronRight size={14} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.studentsScroll}
        contentContainerStyle={styles.studentsScrollContent}
      >
        {students.map((s) => (
          <View key={s.id} style={styles.studentCard}>
            <View style={styles.studentAvatarWrapper}>
              <Image
                source={s.avatar}
                style={styles.studentAvatar}
                resizeMode="cover"
              />
              <View
                style={[styles.onlineDot, { backgroundColor: DOT_COLOR[s.status] }]}
              />
            </View>
            <Text style={styles.studentName} numberOfLines={1}>
              {s.name}
            </Text>
            <Text
              style={[styles.studentStatus, { color: STATUS_COLOR[s.status] }]}
            >
              {STATUS_LABEL[s.status]}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
