import { Text, TouchableOpacity, View } from 'react-native';
import { UserPlus } from 'lucide-react-native';

import { styles } from '../../styles';

interface Props {
  onPress?: () => void;
}

export default function EnrollFAB({ onPress }: Props) {
  return (
    <View style={styles.fabWrapper} pointerEvents="box-none">
      <TouchableOpacity style={styles.fab} onPress={onPress}>
        <UserPlus size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.fabLabel}>Ghi danh</Text>
    </View>
  );
}
