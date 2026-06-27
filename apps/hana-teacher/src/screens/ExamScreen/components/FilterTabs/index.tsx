import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Search } from 'lucide-react-native';

import { ExamFilterTab } from '../../types';
import { FILTER_TABS } from '../../constants';
import { styles } from '../../styles';

interface Props {
  activeTab: ExamFilterTab;
  onTabChange: (tab: ExamFilterTab) => void;
  onSearch?: () => void;
}

export default function FilterTabs({ activeTab, onTabChange, onSearch }: Props) {
  return (
    <View style={styles.filterWrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
        style={{ flex: 1 }}
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

      <TouchableOpacity style={styles.filterSearchBtn} onPress={onSearch}>
        <Search size={18} color="#94A3B8" />
      </TouchableOpacity>
    </View>
  );
}
