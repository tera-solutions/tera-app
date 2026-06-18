import { ReactNode } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { styles } from './style';

export interface Todo {
  id: number;
  title: string;
  count: number;
  icon: ReactNode;
}

interface Props {
  item: Todo;
  onPress?: (item: Todo) => void;
}

export default function TodoItem({
  item,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.item}
      onPress={() => onPress?.(item)}
    >
      <View style={styles.leftSection}>
        <View style={styles.iconContainer}>
          {item.icon}
        </View>

        <View>
          <Text style={styles.itemTitle}>
            {item.title}
          </Text>

          <Text style={styles.itemSubtitle}>
            {item.count} mục đang chờ
          </Text>
        </View>
      </View>

      <View style={styles.rightSection}>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {item.count}
          </Text>
        </View>

        <ChevronRight
          size={18}
          color="#94A3B8"
        />
      </View>
    </TouchableOpacity>
  );
}