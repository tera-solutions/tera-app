import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ParentFilterTab } from '../../types';
import { FILTER_TABS } from '../../constants';
import { styles } from '../../styles';

interface Props {
  activeTab: ParentFilterTab;
  onTabChange: (tab: ParentFilterTab) => void;
}

export default function FilterTabs({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.filterWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {FILTER_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.filterTab, activeTab === tab.key && styles.filterTabActive]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text
              style={[
                styles.filterTabText,
                activeTab === tab.key && styles.filterTabTextActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
