import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

interface Props {
  onCreateNew?: () => void;
}

export default function ExamHeader({ onCreateNew }: Props) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBg}
        resizeMode="cover"
      />
      <TouchableOpacity
        style={styles.headerLeftPlaceholder}
        onPress={() => router.back()}
      >
        <Icon source="chevron-left" size={28} color="#FFFFFF" />
      </TouchableOpacity>

      <Text style={styles.headerTitle}>Bài kiểm tra</Text>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.createBtn} onPress={onCreateNew}>
          <Plus size={14} color="#FFFFFF" />
          <Text style={styles.createBtnText}>Tạo mới</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.headerIconBtn}>
          <Icon source="bell-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
