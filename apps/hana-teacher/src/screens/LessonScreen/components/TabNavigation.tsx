import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles';

export interface LessonTab {
  value: string;
  text: string;
}

interface TabNavigationProps {
  tabs: LessonTab[];
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const TabNavigation = ({ tabs, activeTab, setActiveTab }: TabNavigationProps) => (
  <View style={styles.tabsContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <TouchableOpacity
            key={tab.value}
            onPress={() => setActiveTab(tab.value)}
            style={[styles.tabItem, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab.text}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);