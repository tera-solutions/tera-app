import { Image, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { CourseDetailInfo } from '../types';
import { styles } from '../styles';

interface Props {
  info: CourseDetailInfo;
}

export default function SummaryCard({ info }: Props) {
  return (
    <View style={styles.summaryCard}>
      {info.thumbnail ? (
        <Image source={{ uri: info.thumbnail }} style={styles.coverImage} resizeMode="cover" />
      ) : (
        <View style={[styles.coverImage, styles.coverPlaceholder]}>
          <Icon source="book-open-variant" size={40} color="#0066CC" />
        </View>
      )}

      <View style={styles.summaryTopRow}>
        <Text style={styles.courseName}>{info.name}</Text>
      </View>
      {!!info.code && <Text style={styles.courseCode}>Mã: {info.code}</Text>}

      <View
        style={[styles.statusBadge, { backgroundColor: info.isActive ? '#F0FDF4' : '#F1F5F9' }]}
      >
        <View style={[styles.statusDot, { backgroundColor: info.isActive ? '#22C55E' : '#94A3B8' }]} />
        <Text style={[styles.statusText, { color: info.isActive ? '#16A34A' : '#64748B' }]}>
          {info.isActive ? 'Đang mở' : 'Ngừng hoạt động'}
        </Text>
      </View>

      {!!info.description && <Text style={styles.descriptionText}>{info.description}</Text>}
    </View>
  );
}
