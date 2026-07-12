import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

export default function RoomHeader() {
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
      <Text style={styles.headerTitle}>Phòng học</Text>
      <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/edu/room-create' as any)}>
        <Plus size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
