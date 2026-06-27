import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { FilterKey, FilterTabItem } from '../../types';
import { styles } from '../../styles';

interface FilterTabsProps {
  tabs: FilterTabItem[];
  activeKey: FilterKey;
  onSelect: (key: FilterKey) => void;
}

export default function FilterTabs({ tabs, activeKey, onSelect }: FilterTabsProps) {
  return (
    <View style={styles.filterTabsWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterTabsScroll}
      >
        {tabs.map((tab) => {
          const isActive = tab.key === activeKey;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.filterTab, isActive && styles.filterTabActive]}
              onPress={() => onSelect(tab.key)}
            >
              <Text style={[styles.filterTabText, isActive && styles.filterTabTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
