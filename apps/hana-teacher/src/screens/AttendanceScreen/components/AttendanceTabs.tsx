import { useState } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';

import { styles } from '../style';

export default function AttendanceTabs() {
  const [activeTab, setActiveTab] = useState('list');
  return (
    <View style={styles.tabs}>
      <TouchableOpacity
        style={[styles.tab, activeTab === 'list' && styles.tabActive]}
        onPress={() => setActiveTab('list')}
      >
        <Text
          style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}
        >
          Danh sách lớp
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.tab, activeTab === 'report' && styles.tabActive]}
        onPress={() => setActiveTab('report')}
      >
        <Text
          style={[
            styles.tabText,
            activeTab === 'report' && styles.activeTabText,
          ]}
        >
          Thống kê
        </Text>
      </TouchableOpacity>
    </View>
  );
}
