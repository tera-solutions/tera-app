import { Text, TouchableOpacity, View } from 'react-native';
import { MessageCircle, Phone, PenLine } from 'lucide-react-native';

import { styles } from '../../styles';

interface ActionBarProps {
  onMessage?: () => void;
  onCall?: () => void;
  onCreateComment?: () => void;
}

export default function ActionBar({ onMessage, onCall, onCreateComment }: ActionBarProps) {
  return (
    <View style={styles.actionBar}>
      <TouchableOpacity style={styles.actionBtnOutline} onPress={onMessage}>
        <MessageCircle size={16} color="#0066CC" />
        <Text style={styles.actionBtnOutlineText}>Nhắn tin</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtnOutline} onPress={onCall}>
        <Phone size={16} color="#0066CC" />
        <Text style={styles.actionBtnOutlineText}>Gọi điện</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.actionBtnFilled} onPress={onCreateComment}>
        <PenLine size={16} color="#FFFFFF" />
        <Text style={styles.actionBtnFilledText}>Tạo nhận xét</Text>
      </TouchableOpacity>
    </View>
  );
}
