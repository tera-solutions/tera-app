import { Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';

import { styles } from '../../styles';

interface Props {
  onPress?: () => void;
}

export default function EnterRoomBtn({ onPress }: Props) {
  return (
    <TouchableOpacity style={styles.enterRoomBtn} onPress={onPress}>
      <Icon source="door-open" size={22} color="#FFFFFF" />
      <Text style={styles.enterRoomBtnText}>Vào phòng học</Text>
    </TouchableOpacity>
  );
}
