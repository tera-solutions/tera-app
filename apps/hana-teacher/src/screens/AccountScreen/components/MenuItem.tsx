import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { styles } from '../style';

export default function MenuItem({
  item,
}: any) {
  const Icon = item.icon;

  return (
    <TouchableOpacity style={styles.menuItem}>
      <View
        style={[
          styles.menuIcon,
          { backgroundColor: item.color },
        ]}
      >
        <Icon size={18} color="#fff" />
      </View>

      <Text style={styles.menuText}>
        {item.title}
      </Text>

      <ChevronRight color="#94A3B8" />
    </TouchableOpacity>
  );
}