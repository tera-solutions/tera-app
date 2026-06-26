import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ClassDetail } from '../../types';
import { styles } from '../../styles';

interface Props {
  detail: ClassDetail;
}

export default function ClassInfoCard({ detail }: Props) {
  return (
    <View style={styles.classCard}>
      <View style={styles.classCardTop}>
        <View style={styles.classImageWrapper}>
          <Image
            source={detail.image}
            style={styles.classImage}
            resizeMode="cover"
          />
          <TouchableOpacity style={styles.classEditBtn}>
            <Icon source="pencil" size={12} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.classInfo}>
          <View style={styles.classBadgeRow}>
            <View style={styles.classBadge}>
              <Text style={styles.classBadgeText}>{detail.subject}</Text>
            </View>
            {detail.isActive && (
              <View style={styles.classStatusBadge}>
                <View style={styles.classStatusDot} />
                <Text style={styles.classStatusText}>Đang hoạt động</Text>
              </View>
            )}
          </View>

          <Text style={styles.className}>{detail.name}</Text>

          <View style={styles.classMetaRow}>
            <Icon source="account-outline" size={14} color="#94A3B8" />
            <Text style={styles.classMetaText}>Trình độ: {detail.level}</Text>
          </View>

          <View style={styles.classMetaRow}>
            <Icon source="calendar-outline" size={14} color="#94A3B8" />
            <Text style={styles.classMetaText}>{detail.schedule}</Text>
          </View>

          <View style={styles.classMetaRow}>
            <Icon source="map-marker-outline" size={14} color="#94A3B8" />
            <Text style={styles.classMetaText}>{detail.room}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
