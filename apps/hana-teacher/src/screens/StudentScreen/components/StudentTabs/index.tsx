import { Text, TouchableOpacity, View } from 'react-native';
import { ArrowUpDown } from 'lucide-react-native';

import { StudentTab } from '../../types';
import { styles } from '../../styles';

interface StudentTabsProps {
  activeTab: StudentTab;
  totalCount: number;
  absentCount: number;
  onTabChange: (tab: StudentTab) => void;
  onSort?: () => void;
}

export default function StudentTabs({
  activeTab,
  totalCount,
  absentCount,
  onTabChange,
  onSort,
}: StudentTabsProps) {
  return (
    <View style={styles.tabsRow}>
      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'list' && styles.tabItemActive]}
        onPress={() => onTabChange('list')}
      >
        <Text style={[styles.tabText, activeTab === 'list' && styles.tabTextActive]}>
          {`Danh sách học viên (${totalCount})`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tabItem, activeTab === 'absent' && styles.tabItemActive]}
        onPress={() => onTabChange('absent')}
      >
        <Text style={[styles.tabText, activeTab === 'absent' && styles.tabTextActive]}>
          {`Vắng học (${absentCount})`}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.tabSortBtn} onPress={onSort}>
        <ArrowUpDown size={14} color="#0066CC" />
        <Text style={styles.tabSortText}>Sắp xếp</Text>
      </TouchableOpacity>
    </View>
  );
}
