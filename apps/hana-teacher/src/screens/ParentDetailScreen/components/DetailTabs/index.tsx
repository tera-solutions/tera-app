import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

import { ParentDetailTab } from '../../types';
import { DETAIL_TABS } from '../../constants';
import { styles } from '../../styles';

interface Props {
  activeTab: ParentDetailTab;
  onTabChange: (tab: ParentDetailTab) => void;
}

export default function DetailTabs({ activeTab, onTabChange }: Props) {
  return (
    <View style={styles.tabsWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabsScroll}
      >
        {DETAIL_TABS.map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => onTabChange(tab.key)}
          >
            <Text
              style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
