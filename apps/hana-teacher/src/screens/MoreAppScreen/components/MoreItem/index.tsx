import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';
import type { MoreItemType } from '../../types';

interface Props {
  item: MoreItemType;
}

export default function MoreItem({ item }: Props) {
  const router = useRouter();
  const Icon = item.icon;

  const handlePress = () => {
    if (item.url) {
      router.push(item.url as any);
    }
  };

  return (
    <TouchableOpacity
      style={styles.moreItem}
      activeOpacity={item.url ? 0.7 : 1}
      onPress={handlePress}
      disabled={!item.url}
    >
      <View style={[styles.moreItemIcon, { backgroundColor: item.color }]}>
        <Icon size={22} color="#FFFFFF" />
      </View>
      <Text style={styles.moreItemLabel} numberOfLines={2}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );
}
