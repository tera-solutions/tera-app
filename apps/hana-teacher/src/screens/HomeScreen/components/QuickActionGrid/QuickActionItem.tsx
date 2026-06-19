import { Text, TouchableOpacity, View, Image } from 'react-native';

import { styles } from './style';

export interface QuickAction {
  key: string;
  title: string;
  icon: any;
  link?: string;
  badge?: number;
}

interface Props {
  item: QuickAction;
  onPress?: (item: QuickAction) => void;
}

export default function QuickActionItem({ item, onPress }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.item}
      onPress={() => onPress?.(item)}
    >
      {!!item.badge && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.badge}</Text>
        </View>
      )}

      <Image
        source={item.icon}
        style={{
          width: 30,
          height: 30,
        }}
        resizeMode="contain"
      />

      <Text style={styles.label}>{item.title}</Text>
    </TouchableOpacity>
  );
}
