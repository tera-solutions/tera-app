import React from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { styles } from '../styles';

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const TabNavigation = ({ tabs, activeTab, setActiveTab }: TabNavigationProps) => (
  <View style={styles.tabsContainer}>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab;
        return (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tabItem, isActive && styles.activeTab]}
          >
            <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tab}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  </View>
);