import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ExamDetailTab } from '../../types';
import { DETAIL_TABS } from '../../constants';
import { styles } from '../../styles';

interface Props {
  activeTab: ExamDetailTab;
  onTabChange: (tab: ExamDetailTab) => void;
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
            <Icon
              source={tab.iconName}
              size={16}
              color={activeTab === tab.key ? '#0066CC' : '#94A3B8'}
            />
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
