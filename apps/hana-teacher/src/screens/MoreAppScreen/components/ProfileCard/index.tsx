import { ChevronRight, Star, UserCircle } from 'lucide-react-native';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { PROFILE } from '../../constants';
import { styles, COLORS } from '../../styles';

export default function ProfileCard() {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.profileCard}
      activeOpacity={0.8}
      onPress={() => router.push('/(tabs)/account')}
    >
      <View style={styles.profileAvatar}>
        {PROFILE.avatarUrl ? (
          <Image
            source={{ uri: PROFILE.avatarUrl }}
            style={styles.profileAvatar}
          />
        ) : (
          <UserCircle size={56} color={COLORS.textMuted} />
        )}
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.profileNameRow}>
          <Text style={styles.profileName}>{PROFILE.name}</Text>
          <Star size={14} color="#F59E0B" fill="#F59E0B" />
        </View>
        <Text style={styles.profileRole}>{PROFILE.role}</Text>
        <Text style={styles.profileSchool}>{PROFILE.school}</Text>
      </View>

      <View style={styles.profileChevron}>
        <ChevronRight size={18} color={COLORS.textMuted} />
      </View>
    </TouchableOpacity>
  );
}
