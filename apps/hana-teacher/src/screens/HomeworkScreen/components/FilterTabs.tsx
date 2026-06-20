import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { styles } from '../styles';

interface FilterTabsProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const FilterTabs = ({
  tabs,
  activeTab,
  setActiveTab,
}: FilterTabsProps) => (
  <View style={styles.tabsContainer}>
    {tabs.map((tab) => {
      const isActive = activeTab === tab;
      return (
        <TouchableOpacity
          key={tab}
          onPress={() => setActiveTab(tab)}
          style={[styles.tabItem, isActive && styles.activeTab]}
        >
          <Text style={[styles.tabText, isActive && styles.activeTabText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);
