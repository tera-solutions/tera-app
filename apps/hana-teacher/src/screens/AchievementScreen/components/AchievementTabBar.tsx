import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

interface TabBarProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const TABS = [
  { id: 'all', label: 'Tất cả' },
  { id: 'achievement', label: 'Thành tích' },
  { id: 'certificate', label: 'Chứng nhận' },
  { id: 'class', label: 'Theo lớp' },
];

export default function AchievementTabBar({
  activeTab,
  onTabChange,
}: TabBarProps) {
  return (
    <View style={styles.tabContainer}>
      {TABS.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tabItem, activeTab === tab.id && styles.tabItemActive]}
          onPress={() => onTabChange(tab.id)}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === tab.id && styles.tabTextActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}
