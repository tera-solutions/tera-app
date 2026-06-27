import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Icon } from 'react-native-paper';
import { Search, SlidersHorizontal } from 'lucide-react-native';

import { styles } from '../../styles';

interface StudentHeaderProps {
  onSearch?: () => void;
  onFilter?: () => void;
}

export default function StudentHeader({ onSearch, onFilter }: StudentHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBg}
        resizeMode="cover"
      />

      <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
        <Icon source="chevron-left" size={26} color="#FFFFFF" />
      </TouchableOpacity>

      <View style={styles.headerTitleBlock}>
        <Text style={styles.headerTitle}>Học viên</Text>
        <Text style={styles.headerSubtitle}>Quản lý và theo dõi học viên của lớp</Text>
      </View>

      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={onSearch}>
          <Search size={18} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.headerIconBtn} onPress={onFilter}>
          <SlidersHorizontal size={18} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
