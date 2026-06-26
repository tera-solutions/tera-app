import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { Announcement } from '../../types';
import { styles } from '../../styles';

interface Props {
  announcements: Announcement[];
}

export default function AnnouncementsCard({ announcements }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.announcementHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Icon source="bell-outline" size={18} color="#F59E0B" />
          <Text style={styles.sectionTitle}>Thông báo</Text>
        </View>
        <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          <Text style={styles.sectionLink}>Xem tất cả</Text>
          <ChevronRight size={14} color="#0066CC" />
        </TouchableOpacity>
      </View>

      {announcements.map((item) => (
        <View key={item.id} style={styles.announcementRow}>
          <View style={styles.announcementBullet} />
          <Text style={styles.announcementText}>{item.text}</Text>
        </View>
      ))}
    </View>
  );
}
