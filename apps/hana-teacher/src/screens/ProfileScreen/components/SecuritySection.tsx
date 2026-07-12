import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { styles } from '../styles';

interface Props {
  onChangePassword: () => void;
}

export default function SecuritySection({ onChangePassword }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Bảo mật</Text>
      <TouchableOpacity style={[styles.actionRow, styles.actionRowFirst]} onPress={onChangePassword}>
        <View style={styles.actionIconWrap}>
          <Icon source="lock-outline" size={16} color="#EF4444" />
        </View>
        <Text style={styles.actionLabel}>Đổi mật khẩu</Text>
        <Icon source="chevron-right" size={18} color="#CBD5E1" />
      </TouchableOpacity>
    </View>
  );
}
