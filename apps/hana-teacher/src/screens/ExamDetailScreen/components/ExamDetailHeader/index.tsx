import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ellipsis } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

interface Props {
  onEdit?: () => void;
}

export default function ExamDetailHeader({ onEdit }: Props) {
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

      <Text style={styles.headerTitle}>Chi tiết bài kiểm tra</Text>

      <View style={styles.headerRight}>
        <TouchableOpacity style={styles.editBtn} onPress={onEdit}>
          <Icon source="pencil-outline" size={14} color="#FFFFFF" />
          <Text style={styles.editBtnText}>Chỉnh sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ellipsis size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
