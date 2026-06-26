import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { styles } from '../../styles';

interface Props {
  count: number;
  onViewNow?: () => void;
}

export default function GradingBanner({ count, onViewNow }: Props) {
  return (
    <View style={styles.gradingBanner}>
      <Icon source="information-outline" size={20} color="#0066CC" />

      <Text style={styles.gradingBannerText}>
        Bạn có{' '}
        <Text style={styles.gradingBannerHighlight}>{count} bài kiểm tra</Text>
        {' '}cần chấm điểm.
      </Text>

      <TouchableOpacity style={styles.gradingBannerLink} onPress={onViewNow}>
        <Text style={styles.gradingBannerLinkText}>Xem ngay</Text>
        <ChevronRight size={14} color="#0066CC" />
      </TouchableOpacity>
    </View>
  );
}
