import { ChevronLeft, GraduationCap } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

export default function MoreHeader() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.back()}
        hitSlop={8}
        activeOpacity={0.7}
      >
        <ChevronLeft size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <View style={styles.headerLabel}>
        <GraduationCap size={14} color="rgba(255,255,255,0.8)" />
        <Text style={styles.headerLabelText}>Giáo viên</Text>
      </View>
      <Text style={styles.headerTitle}>More App</Text>
    </View>
  );
}
