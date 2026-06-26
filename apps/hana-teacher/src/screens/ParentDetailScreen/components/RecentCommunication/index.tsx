import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { CommunicationItem } from '../../types';
import { styles } from '../../styles';

interface Props {
  items: CommunicationItem[];
  onViewAll?: () => void;
}

export default function RecentCommunication({ items, onViewAll }: Props) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Giao tiếp gần đây</Text>
        <TouchableOpacity style={styles.sectionLink} onPress={onViewAll}>
          <Text style={styles.sectionLinkText}>Xem tất cả</Text>
          <ChevronRight size={14} color="#0066CC" />
        </TouchableOpacity>
      </View>

      {items.map((item) => (
        <View key={item.id} style={styles.commItem}>
          <View style={[styles.commIcon, { backgroundColor: item.iconBg }]}>
            <Icon source={item.iconName} size={20} color={item.iconColor} />
          </View>
          <View style={styles.commBody}>
            <Text style={styles.commTitle}>{item.title}</Text>
            <Text style={styles.commDesc}>{item.description}</Text>
          </View>
          <View style={styles.commRight}>
            <Text style={styles.commDate}>{item.date}</Text>
            <Text style={styles.commTime}>{item.time}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
