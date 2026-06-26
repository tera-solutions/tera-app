import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { styles } from '../style';

export default function MenuItem({ item }: any) {
  const Icon = item.icon;
  const router = useRouter();

  return (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => item?.link && router.push(item?.link)}
    >
      <View style={[styles.menuIcon, { backgroundColor: item.color }]}>
        <Icon size={18} color="#fff" />
      </View>

      <Text style={styles.menuText}>{item.title}</Text>

      <ChevronRight color="#94A3B8" />
    </TouchableOpacity>
  );
}
