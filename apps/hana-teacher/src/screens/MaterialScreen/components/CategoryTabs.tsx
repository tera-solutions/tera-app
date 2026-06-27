import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export interface CategoryTab {
  value: string;
  text: string;
  icon: string;
}

interface Props {
  tabs: CategoryTab[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const CategoryTabs = ({ tabs, activeTab, setActiveTab }: Props) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    style={styles.categoryScroll}
    contentContainerStyle={styles.categoryScrollContent}
  >
    {tabs.map((tab) => {
      const isActive = activeTab === tab.value;
      return (
        <TouchableOpacity
          key={tab.value}
          onPress={() => setActiveTab(tab.value)}
          style={[styles.categoryTab, isActive && styles.categoryTabActive]}
        >
          <Icon source={tab.icon} size={16} color={isActive ? '#FFFFFF' : '#64748B'} />
          <Text style={[styles.categoryTabText, isActive && styles.categoryTabTextActive]}>
            {tab.text}
          </Text>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);
