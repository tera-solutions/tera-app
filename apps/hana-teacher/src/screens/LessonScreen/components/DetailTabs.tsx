import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

import { DETAIL_TABS } from '../constants';
import type { LessonDetailTab } from '../types';
import { styles } from '../styles';

interface Props {
  activeTab: LessonDetailTab;
  onTabChange: (tab: LessonDetailTab) => void;
}

export const DetailTabs = ({ activeTab, onTabChange }: Props) => (
  <View style={styles.tabsContainer}>
    {DETAIL_TABS.map((tab) => {
      const isActive = activeTab === tab.key;
      return (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          style={[styles.tabItem, isActive && styles.activeTab]}
        >
          <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.label}</Text>
        </TouchableOpacity>
      );
    })}
  </View>
);
