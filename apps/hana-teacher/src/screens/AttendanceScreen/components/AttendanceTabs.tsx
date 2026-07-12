import { Text, View, TouchableOpacity } from 'react-native';

import { styles } from '../style';
import type { AttendanceTab } from '../types';

interface Props {
  activeTab: AttendanceTab;
  onTabChange: (tab: AttendanceTab) => void;
}

export default function AttendanceTabs({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'list' && styles.tabActive]}
        onPress={() => onTabChange('list')}
      >
        <Text style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}>
          Danh sách lớp
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'report' && styles.tabActive]}
        onPress={() => onTabChange('report')}
      >
        <Text style={[styles.tabText, activeTab === 'report' && styles.activeTabText]}>
          Thống kê
        </Text>
      </TouchableOpacity>
    </View>
  );
}
