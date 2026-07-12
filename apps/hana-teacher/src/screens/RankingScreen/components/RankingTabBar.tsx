import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '../styles';
import { RANKING_TABS } from '../constants';
import type { RankingTab } from '../types';

interface Props {
  activeTab: RankingTab;
  onChange: (tab: RankingTab) => void;
}

export const RankingTabBar = ({ activeTab, onChange }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.tabsScroll}
    contentContainerStyle={{ paddingRight: 8 }}
  >
    {RANKING_TABS.map((tab) => {
      const active = tab.key === activeTab;
      return (
        <TouchableOpacity
          key={tab.key}
          style={[styles.tabItem, active && styles.activeTab]}
          onPress={() => onChange(tab.key)}
        >
          <Text style={[styles.tabText, active && styles.activeTabText]}>{tab.label}</Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);
