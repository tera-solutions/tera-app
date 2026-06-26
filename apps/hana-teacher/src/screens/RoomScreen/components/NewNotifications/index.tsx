import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { RoomNotification } from '../../types';
import { styles } from '../../styles';

interface Props {
  notifications: RoomNotification[];
  onViewAll?: () => void;
}

export default function NewNotifications({ notifications, onViewAll }: Props) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Thông báo mới</Text>
        <TouchableOpacity style={styles.sectionLink} onPress={onViewAll}>
          <Text style={styles.sectionLinkText}>Xem tất cả</Text>
          <ChevronRight size={14} color="#0066CC" />
        </TouchableOpacity>
      </View>

      {notifications.map((n) => (
        <View key={n.id} style={styles.notifItem}>
          <View style={[styles.notifIcon, { backgroundColor: n.iconBg }]}>
            <Icon source={n.iconName} size={20} color={n.iconColor} />
          </View>
          <View style={styles.notifBody}>
            <Text style={styles.notifTitle}>{n.title}</Text>
            <Text style={styles.notifDesc}>{n.description}</Text>
            <Text style={styles.notifTime}>{n.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
