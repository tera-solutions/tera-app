import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-paper';

import { styles } from '../styles';

interface Props {
  onEdit?: () => void;
}

export default function DetailHeader({ onEdit }: Props) {
  const router = useRouter();

  return (
    <View style={styles.headerOuter}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBg}
        resizeMode="cover"
      />
      <View style={styles.headerTopRow}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <Icon source="chevron-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitleCenter}>Chi tiết khóa học</Text>
        <TouchableOpacity style={styles.headerIconBtn} onPress={onEdit}>
          <Icon source="pencil-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
