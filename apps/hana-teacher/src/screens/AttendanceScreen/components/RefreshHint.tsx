import { Text, View } from 'react-native';
import { RefreshCcw } from 'lucide-react-native';

import { styles } from '../style';

export default function RefreshHint() {
  return (
    <View style={styles.refresh}>
      <RefreshCcw
        size={18}
        color="#94A3B8"
      />

      <Text style={styles.refreshText}>
        Kéo xuống để làm mới danh sách
      </Text>
    </View>
  );
}