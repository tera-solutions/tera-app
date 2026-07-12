import { Text, TouchableOpacity, View } from 'react-native';
import { UserPlus } from 'lucide-react-native';

import { styles } from '../../styles';

interface Props {
  label?: string;
  onPress?: () => void;
}

export default function EnrollFAB({ label = 'Ghi danh', onPress }: Props) {
  return (
    <View style={styles.fabWrapper} pointerEvents="box-none">
      <TouchableOpacity style={styles.fab} onPress={onPress}>
        <UserPlus size={24} color="#FFFFFF" />
      </TouchableOpacity>
      <Text style={styles.fabLabel}>{label}</Text>
    </View>
  );
}
