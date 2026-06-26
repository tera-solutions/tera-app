import { Text, TouchableOpacity, View } from 'react-native';
import {
  Bell,
  Calendar,
  CalendarClock,
  ClipboardCheck,
  MessageSquare,
  Megaphone,
  Trophy,
  Users,
} from 'lucide-react-native';
import { LucideIcon } from 'lucide-react-native';

import { NotificationItemType, NotificationType } from '../../types';
import { styles } from '../../styles';

interface NotificationItemProps {
  item: NotificationItemType;
  showSeparator?: boolean;
  onPress?: (item: NotificationItemType) => void;
}

interface IconConfig {
  Icon: LucideIcon;
  bg: string;
}

const ICON_MAP: Record<NotificationType, IconConfig> = {
  homework: { Icon: ClipboardCheck, bg: '#7C3AED' },
  classroom: { Icon: Users, bg: '#10B981' },
  comment: { Icon: MessageSquare, bg: '#F59E0B' },
  deadline: { Icon: CalendarClock, bg: '#EF4444' },
  achievement: { Icon: Trophy, bg: '#F59E0B' },
  system: { Icon: Megaphone, bg: '#0066CC' },
  schedule: { Icon: Calendar, bg: '#0066CC' },
};

export default function NotificationItem({ item, showSeparator = false, onPress }: NotificationItemProps) {
  const config = ICON_MAP[item.type] ?? { Icon: Bell, bg: '#64748B' };
  const { Icon, bg } = config;

  return (
    <>
      {showSeparator && <View style={styles.itemSeparator} />}
      <TouchableOpacity
        style={styles.itemContainer}
        activeOpacity={0.7}
        onPress={() => onPress?.(item)}
      >
        <View style={[styles.itemIconWrapper, { backgroundColor: bg }]}>
          <Icon size={22} color="#FFFFFF" />
        </View>

        <View style={styles.itemBody}>
          <View style={styles.itemTopRow}>
            <Text
              style={[styles.itemTitle, item.isRead && styles.itemTitleRead]}
              numberOfLines={1}
            >
              {item.title}
            </Text>
            <Text style={styles.itemTime}>{item.time}</Text>
          </View>

          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>

          <View style={styles.itemTagRow}>
            <View style={[styles.itemTag, { backgroundColor: item.tagColor }]}>
              <Text style={[styles.itemTagText, { color: item.tagTextColor ?? '#0066CC' }]}>
                {item.tag}
              </Text>
            </View>
            <View style={item.isRead ? styles.itemReadDot : styles.itemUnreadDot} />
          </View>
        </View>
      </TouchableOpacity>
    </>
  );
}
