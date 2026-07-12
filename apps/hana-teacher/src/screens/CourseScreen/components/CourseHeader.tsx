import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../styles';

export default function CourseHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBg}
        resizeMode="cover"
      />
      <TouchableOpacity style={styles.headerLeftPlaceholder} onPress={() => router.back()}>
        <Icon source="chevron-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Khóa học</Text>

      <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/edu/course-create' as any)}>
        <Plus size={14} color="#FFFFFF" />
        <Text style={styles.createBtnText}>Tạo mới</Text>
      </TouchableOpacity>
    </View>
  );
}
