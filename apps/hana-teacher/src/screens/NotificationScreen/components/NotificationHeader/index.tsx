import { Image, Text, TouchableOpacity, View } from 'react-native';
import { CheckCheck } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

interface NotificationHeaderProps {
  onMarkAllRead?: () => void;
}

export default function NotificationHeader({
  onMarkAllRead,
}: NotificationHeaderProps) {
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
      <Text style={styles.headerTitle}>Thông báo</Text>
      <TouchableOpacity style={styles.headerMarkBtn} onPress={onMarkAllRead}>
        <CheckCheck size={15} color="#FFFFFF" />
        <Text style={styles.headerMarkText}>Đã đọc</Text>
      </TouchableOpacity>
    </View>
  );
}
