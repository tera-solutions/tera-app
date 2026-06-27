import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

interface Props {
  notificationCount?: number;
}

export default function ParentHeader({ notificationCount = 12 }: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBg}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
        <Icon source="chevron-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Phụ huynh</Text>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.iconButton}>
          <Icon source="magnify" size={22} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={[styles.iconButton, styles.bellBadgeWrapper]}>
          <Icon source="bell-outline" size={22} color="#FFFFFF" />
          {notificationCount > 0 && (
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
