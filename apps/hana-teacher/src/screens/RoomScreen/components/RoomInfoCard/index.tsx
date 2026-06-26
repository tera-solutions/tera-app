import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { RoomInfo } from '../../types';
import { styles } from '../../styles';

interface Props {
  info: RoomInfo;
  onEdit?: () => void;
}

export default function RoomInfoCard({ info, onEdit }: Props) {
  return (
    <View style={styles.infoCard}>
      <Image source={info.image} style={styles.roomPhoto} resizeMode="cover" />

      <View style={styles.infoBody}>
        <View style={styles.infoTopRow}>
          <Text style={styles.roomName} numberOfLines={2}>
            {info.name}
          </Text>
          <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
            <Icon source="pencil-outline" size={12} color="#0066CC" />
            <Text style={styles.editBtnText}>Chỉnh sửa</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.classTag}>
          <Text style={styles.classTagText}>{info.className}</Text>
        </View>

        <View style={styles.infoMetaRow}>
          <Icon source="account-group-outline" size={14} color="#94A3B8" />
          <Text style={styles.infoMetaText}>Sức chứa: {info.capacity} học viên</Text>
        </View>

        <View style={styles.infoMetaRow}>
          <Icon source="calendar-outline" size={14} color="#94A3B8" />
          <Text style={styles.infoMetaText}>Thiết bị: {info.equipment}</Text>
        </View>

        {info.status === 'active' && (
          <View style={styles.statusBadge}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>Đang hoạt động</Text>
          </View>
        )}
      </View>
    </View>
  );
}
