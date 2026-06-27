import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ellipsis } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

export default function ParentDetailHeader() {
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
      <Text style={styles.headerTitle}>Chi tiết phụ huynh</Text>
      <TouchableOpacity style={styles.iconButton}>
        <Ellipsis size={20} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  );
}
