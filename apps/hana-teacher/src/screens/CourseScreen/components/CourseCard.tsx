import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { CourseListItem } from '../types';
import { styles } from '../styles';

interface Props {
  item: CourseListItem;
  onPress?: () => void;
  onEdit?: () => void;
}

const formatPrice = (value: number) => `${value.toLocaleString('en-US')}đ`;

export default function CourseCard({ item, onPress, onEdit }: Props) {
  return (
    <TouchableOpacity style={styles.courseCard} onPress={onPress} activeOpacity={0.7}>
      {item.thumbnail ? (
        <Image source={{ uri: item.thumbnail }} style={styles.coursePhoto} resizeMode="cover" />
      ) : (
        <View style={[styles.coursePhoto, styles.coursePhotoPlaceholder]}>
          <Icon source="book-open-variant" size={30} color="#0066CC" />
        </View>
      )}

      <View style={styles.courseBody}>
        <View style={styles.courseTopRow}>
          <Text style={styles.courseName} numberOfLines={2}>
            {item.name}
          </Text>
          <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
            <Icon source="pencil-outline" size={12} color="#0066CC" />
            <Text style={styles.editBtnText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        {!!item.code && <Text style={styles.courseCode}>Mã: {item.code}</Text>}

        <View style={styles.courseMetaRow}>
          <Icon source="clock-outline" size={14} color="#94A3B8" />
          <Text style={styles.courseMetaText}>{item.durationMinutes} phút / buổi</Text>
        </View>

        <View style={styles.courseMetaRow}>
          <Icon source="currency-usd" size={14} color="#94A3B8" />
          <Text style={styles.courseMetaText}>{formatPrice(item.pricePerLesson)} / buổi</Text>
        </View>

        <View
          style={[
            styles.statusBadge,
            { backgroundColor: item.isActive ? '#F0FDF4' : '#F1F5F9' },
          ]}
        >
          <View style={[styles.statusDot, { backgroundColor: item.isActive ? '#22C55E' : '#94A3B8' }]} />
          <Text style={[styles.statusText, { color: item.isActive ? '#16A34A' : '#64748B' }]}>
            {item.isActive ? 'Đang mở' : 'Ngừng hoạt động'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}
