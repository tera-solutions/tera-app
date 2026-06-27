import { Text, TouchableOpacity, View } from 'react-native';
import { Plus } from 'lucide-react-native';

import { styles } from '../../styles';

interface Props {
  onPress?: () => void;
}

export default function FAB({ onPress }: Props) {
  return (
    <View style={styles.fabWrapper} pointerEvents="box-none">
      <TouchableOpacity style={styles.fab} onPress={onPress}>
        <Plus size={26} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.fabLabel}>Thêm phụ huynh</Text>
    </View>
  );
}
