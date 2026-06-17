import { Text, TouchableOpacity, View } from 'react-native';
import { Bell, ChevronRight } from 'lucide-react-native';

import { styles } from './style';

export interface Notification {
  id: number;
  title: string;
  time: string;
  isRead: boolean;
}

interface Props {
  item: Notification;
  onPress?: (item: Notification) => void;
}

export default function NotificationItem({
  item,
  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={[
        styles.item,
        !item.isRead && styles.unreadItem,
      ]}
      onPress={() => onPress?.(item)}
    >
      <View style={styles.leftSection}>
        <View
          style={[
            styles.iconContainer,
            !item.isRead &&
              styles.unreadIconContainer,
          ]}
        >
          <Bell
            size={18}
            color={
              item.isRead
                ? '#64748B'
                : '#0066cc'
            }
          />
        </View>

        <View style={styles.content}>
          <Text
            numberOfLines={2}
            style={[
              styles.message,
              !item.isRead &&
                styles.unreadMessage,
            ]}
          >
            {item.title}
          </Text>

          <Text style={styles.time}>
            {item.time}
          </Text>
        </View>
      </View>

      <ChevronRight
        size={18}
        color="#94A3B8"
      />
    </TouchableOpacity>
  );
}