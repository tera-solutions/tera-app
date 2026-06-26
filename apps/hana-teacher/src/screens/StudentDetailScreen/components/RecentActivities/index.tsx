import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { ActivityItem } from '../../types';
import { ACTIVITY_CONFIG } from '../../constants';
import { styles } from '../../styles';

interface RecentActivitiesProps {
  activities: ActivityItem[];
  onViewAll?: () => void;
}

function ActivityRow({ item, showSep }: { item: ActivityItem; showSep: boolean }) {
  const cfg = ACTIVITY_CONFIG[item.type];

  return (
    <>
      {showSep && <View style={styles.activitySeparator} />}
      <View style={styles.activityItem}>
        <View style={[styles.activityIcon, { backgroundColor: cfg.bg }]}>
          <Icon source={cfg.iconName} size={20} color={cfg.color} />
        </View>

        <View style={styles.activityBody}>
          <Text style={styles.activityTitle}>{item.title}</Text>
          <Text style={styles.activityDesc} numberOfLines={1}>
            {item.description}
          </Text>
        </View>

        <View style={styles.activityRight}>
          {item.isOverdue ? (
            <View style={styles.overdueBadge}>
              <Text style={styles.overdueBadgeText}>Quá hạn</Text>
            </View>
          ) : null}
          <Text style={styles.activityDate}>{item.date}</Text>
          {!!item.time && <Text style={styles.activityTime}>{item.time}</Text>}
        </View>

        <ChevronRight size={16} color="#CBD5E1" />
      </View>
    </>
  );
}

export default function RecentActivities({ activities, onViewAll }: RecentActivitiesProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="star-circle-outline" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Hoạt động gần đây</Text>
        </View>
      </View>

      {activities.map((item, idx) => (
        <ActivityRow key={item.id} item={item} showSep={idx > 0} />
      ))}

      <TouchableOpacity style={styles.viewAllBtn} onPress={onViewAll}>
        <Text style={styles.viewAllText}>Xem tất cả hoạt động</Text>
        <ChevronRight size={14} color="#0066CC" />
      </TouchableOpacity>
    </View>
  );
}
