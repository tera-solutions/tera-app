import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ProfileData } from '../types';
import { styles } from '../styles';

interface Props {
  profile: ProfileData;
  onEdit?: () => void;
}

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

export default function ProfileCard({ profile, onEdit }: Props) {
  return (
    <View style={styles.profileCard}>
      {profile.avatar_url ? (
        <Image source={{ uri: profile.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarInitials]}>
          <Text style={styles.avatarInitialsText}>{initialOf(profile.full_name)}</Text>
        </View>
      )}

      <Text style={styles.profileName}>{profile.full_name || '—'}</Text>

      <View style={styles.roleBadge}>
        <Text style={styles.roleBadgeText}>{profile.role_name}</Text>
      </View>

      <View style={styles.onlineRow}>
        <View style={[styles.onlineDot, { backgroundColor: profile.is_online ? '#22C55E' : '#CBD5E1' }]} />
        <Text style={styles.onlineText}>{profile.is_online ? 'Đang hoạt động' : 'Ngoại tuyến'}</Text>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
        <Icon source="pencil-outline" size={14} color="#0066CC" />
        <Text style={styles.editBtnText}>Chỉnh sửa thông tin</Text>
      </TouchableOpacity>
    </View>
  );
}
