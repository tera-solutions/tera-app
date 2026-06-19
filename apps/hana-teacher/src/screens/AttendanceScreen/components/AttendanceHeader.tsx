import { Text, Image, TouchableOpacity, View } from 'react-native';
import { ArrowLeft, CalendarDays } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { styles } from '../style';

export default function AttendanceHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBackground}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => router.back()}
      >
        <ArrowLeft size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Điểm danh</Text>

      <TouchableOpacity style={styles.headerButton}>
        <CalendarDays size={22} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}
