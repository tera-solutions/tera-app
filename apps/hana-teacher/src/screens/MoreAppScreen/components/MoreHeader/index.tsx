import { GraduationCap } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { styles } from '../../styles';

export default function MoreHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.headerLabel}>
        <GraduationCap size={14} color="rgba(255,255,255,0.8)" />
        <Text style={styles.headerLabelText}>Giáo viên</Text>
      </View>
      <Text style={styles.headerTitle}>More App</Text>
    </View>
  );
}
