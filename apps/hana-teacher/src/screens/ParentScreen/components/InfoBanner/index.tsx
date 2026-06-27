import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { styles } from '../../styles';

interface Props {
  onViewDetail?: () => void;
}

export default function InfoBanner({ onViewDetail }: Props) {
  return (
    <View style={styles.infoBanner}>
      <Icon source="information-outline" size={20} color="#0066CC" />
      <Text style={styles.infoBannerText}>
        Giữ kết nối thường xuyên giúp tăng hiệu quả học tập của học viên.
      </Text>
      <TouchableOpacity style={styles.infoBannerLink} onPress={onViewDetail}>
        <Text style={styles.infoBannerLinkText}>Xem chi tiết</Text>
        <ChevronRight size={14} color="#0066CC" />
      </TouchableOpacity>
    </View>
  );
}
