import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { LessonStatusTab } from '../types';
import { STATUS_TABS } from '../constants';
import { styles } from '../styles';

interface Props {
  activeTab: LessonStatusTab;
  onTabChange: (tab: LessonStatusTab) => void;
}

export default function StatusTabs({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.tabsWrapper}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
        {STATUS_TABS.map((tab) => {
          const active = tab.key === activeTab;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => onTabChange(tab.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
