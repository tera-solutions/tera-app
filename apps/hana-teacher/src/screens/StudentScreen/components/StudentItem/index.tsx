import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Star } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { StudentItem as StudentItemType } from '../../types';
import { styles } from '../../styles';

interface StudentItemProps {
  item: StudentItemType;
  onPress?: (item: StudentItemType) => void;
}

export default function StudentItem({ item, onPress }: StudentItemProps) {
  const isPresent = item.status === 'present';

  return (
    <TouchableOpacity
      style={styles.studentItem}
      activeOpacity={0.7}
      onPress={() => onPress?.(item)}
    >
      <Text style={styles.studentIndex}>{String(item.index).padStart(2, '0')}</Text>

      <Image source={item.avatar} style={styles.studentAvatar} resizeMode="cover" />

      <View style={styles.studentBody}>
        <Text style={styles.studentName}>{item.name}</Text>

        <View style={styles.studentMeta}>
          <Icon source="calendar" size={12} color="#94A3B8" />
          <Text style={styles.studentMetaText}>{item.birthday}</Text>
          <Text style={styles.studentMetaText}>•</Text>
          <Icon
            source={item.gender === 'Nam' ? 'gender-male' : 'gender-female'}
            size={12}
            color="#94A3B8"
          />
          <Text style={styles.studentMetaText}>{item.gender}</Text>
        </View>

        <View style={styles.studentRatingRow}>
          <Star size={12} fill="#F59E0B" color="#F59E0B" />
          <Text style={styles.studentRatingText}>{item.rating}</Text>
          <View style={[styles.studentTag, { backgroundColor: item.tagColor }]}>
            <Text style={[styles.studentTagText, { color: item.tagTextColor }]}>
              {item.tag}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.studentRight}>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: isPresent ? '#ECFDF3' : '#FFF1F2' },
          ]}
        >
          <Text
            style={[
              styles.statusBadgeText,
              { color: isPresent ? '#16A34A' : '#EF4444' },
            ]}
          >
            {isPresent ? 'Đi học' : 'Vắng'}
          </Text>
        </View>
        <Text style={styles.studentAttendance}>
          {isPresent ? `Chuyên cần: ${item.attendanceRate}%` : `Vắng ${100 - item.attendanceRate < 20 ? '1' : '2'} buổi`}
        </Text>
      </View>

      <ChevronRight size={16} color="#CBD5E1" />
    </TouchableOpacity>
  );
}
