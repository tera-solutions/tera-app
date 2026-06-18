import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { styles } from '../styles';

export type TabType = 'plan' | 'taught' | 'upcoming' | 'all';

interface LessonTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const LessonTabs: React.FC<LessonTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs: { key: TabType; label: string }[] = [
    { key: 'plan', label: 'Kế hoạch' },
    { key: 'taught', label: 'Đã giảng' },
    { key: 'upcoming', label: 'Sắp tới' },
    { key: 'all', label: 'Tất cả' },
  ];

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.tabsScroll}
      contentContainerStyle={styles.tabsContainer}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={[styles.tabButton, isActive && styles.activeTabButton]}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>
              {tab.label}
            </Text>
            {isActive && <View style={styles.activeIndicator} />}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};