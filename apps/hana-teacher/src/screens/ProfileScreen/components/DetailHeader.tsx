import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-paper';

import { styles } from '../styles';

export default function DetailHeader() {
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
        <Text style={styles.headerTitleCenter}>Hồ sơ cá nhân</Text>
        <View style={{ width: 36 }} />
      </View>
    </View>
  );
}
