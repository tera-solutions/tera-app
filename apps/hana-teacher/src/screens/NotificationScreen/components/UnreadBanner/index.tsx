import { Text, TouchableOpacity, View } from 'react-native';
import { BellRing } from 'lucide-react-native';

import { styles } from '../../styles';

interface UnreadBannerProps {
  count: number;
  onViewNow?: () => void;
}

export default function UnreadBanner({ count, onViewNow }: UnreadBannerProps) {
  return (
    <View style={styles.unreadBanner}>
      <View style={styles.unreadBannerIcon}>
        <BellRing size={24} color="#FFFFFF" />
      </View>

      <View style={styles.unreadBannerBody}>
        <Text style={styles.unreadBannerTitle}>
          {'Bạn có '}
          <Text style={styles.unreadBannerTitleBold}>{count} thông báo chưa đọc</Text>
        </Text>
        <Text style={styles.unreadBannerSubtitle}>
          Cập nhật thông tin để không bỏ lỡ thông báo quan trọng
        </Text>
      </View>

      <TouchableOpacity style={styles.unreadBannerBtn} onPress={onViewNow}>
        <Text style={styles.unreadBannerBtnText}>Xem ngay</Text>
      </TouchableOpacity>
    </View>
  );
}
