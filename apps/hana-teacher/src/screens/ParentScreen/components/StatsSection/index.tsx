import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ParentStats } from '../../types';
import { styles } from '../../styles';

interface Props {
  stats: ParentStats;
}

export default function StatsSection({ stats }: Props) {
  const ITEMS = [
    { value: stats.total, label: 'Tổng phụ huynh', iconName: 'account-group-outline', iconBg: '#EEF5FF', iconColor: '#2196F3' },
    { value: stats.contacted, label: 'Đã liên hệ', iconName: 'message-text-outline', iconBg: '#F0FDF4', iconColor: '#22C55E' },
    { value: stats.notContacted, label: 'Chưa liên hệ', iconName: 'clock-outline', iconBg: '#FFF7ED', iconColor: '#F97316' },
    { value: stats.newParents, label: 'Phụ huynh mới', iconName: 'account-multiple-outline', iconBg: '#F5F3FF', iconColor: '#8B5CF6' },
  ];

  return (
    <View style={styles.statsCard}>
      <Text style={styles.statsTitle}>Tổng quan</Text>
      <View style={styles.statsRow}>
        {ITEMS.map((item, i) => (
          <View key={item.label} style={[styles.statBox, i > 0 && styles.statBoxBorder]}>
            <View style={[styles.statIconWrapper, { backgroundColor: item.iconBg }]}>
              <Icon source={item.iconName} size={22} color={item.iconColor} />
            </View>
            <Text style={[styles.statValue, { color: item.iconColor }]}>{item.value}</Text>
            <Text style={styles.statLabel}>{item.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
