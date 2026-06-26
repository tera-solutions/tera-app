import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { styles } from '../../styles';

interface AbsenceSectionProps {
  absenceDates: string[];
  onViewAll?: () => void;
}

export default function AbsenceSection({ absenceDates, onViewAll }: AbsenceSectionProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="calendar-remove-outline" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Buổi học vắng mặt</Text>
        </View>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.viewAllText}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.absenceCount}>{absenceDates.length} buổi vắng mặt</Text>
      <Text style={styles.absenceDates}>{absenceDates.join(' • ')}</Text>
    </View>
  );
}
