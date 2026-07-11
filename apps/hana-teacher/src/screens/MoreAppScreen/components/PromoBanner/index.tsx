import { BookOpen, GraduationCap } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { styles } from '../../styles';

export default function PromoBanner() {
  return (
    <View style={styles.promoBanner}>
      <View style={styles.promoBannerContent}>
        <Text style={styles.promoBannerTitle}>
          Hana Edu luôn đồng hành{'\n'}cùng Thầy Cô
        </Text>
        <Text style={styles.promoBannerDesc}>
          Ứng dụng giúp quản lý lớp học và{'\n'}giảng dạy hiệu quả hơn mỗi ngày.
        </Text>
      </View>
      <View style={styles.promoBannerIcons}>
        <BookOpen size={32} color="rgba(255,255,255,0.5)" />
        <GraduationCap size={36} color="rgba(255,255,255,0.7)" />
      </View>
    </View>
  );
}
