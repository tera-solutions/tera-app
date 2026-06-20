import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

interface GradingTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const GradingTabs = ({ activeTab, setActiveTab }: GradingTabsProps) => (
  <View style={styles.tabsContainer}>
    <TouchableOpacity
      style={[styles.tabItem, activeTab === 'list' && styles.activeTab]}
      onPress={() => setActiveTab('list')}
    >
      <Text
        style={[styles.tabText, activeTab === 'list' && styles.activeTabText]}
      >
        Danh sách học viên
      </Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.tabItem, activeTab === 'stats' && styles.activeTab]}
      onPress={() => setActiveTab('stats')}
    >
      <Text
        style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}
      >
        Thống kê kết quả
      </Text>
    </TouchableOpacity>
  </View>
);
