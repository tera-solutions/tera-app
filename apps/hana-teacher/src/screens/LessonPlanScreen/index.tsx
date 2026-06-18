import React, { useState } from 'react';
import { View, Text, StatusBar, Image } from 'react-native';
import { Searchbar, Button, IconButton, Icon } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

import { styles } from './styles';
import { ClassHeader } from './components/ClassHeader';
import { StatisticCards } from './components/StatisticCards';
import { LessonItem, LessonData } from './components/LessonItem';
import { QuickCreateBanner } from './components/QuickCreateBanner';
import { LessonTabs, TabType } from './components/LessonTabs';

const MOCK_LESSONS: LessonData[] = [
  {
    id: '1',
    index: '01',
    title: 'Hello! - Getting to know you',
    unit: 'Unit 1: My World',
    duration: '45 phút',
    status: 'done',
    date: '10/05/2025',
    thumb: require('@tera/assets/app/element_70.png'),
  },
  {
    id: '2',
    index: '02',
    title: 'Numbers 1-10',
    unit: 'Unit 1: My World',
    duration: '45 phút',
    status: 'done',
    date: '12/05/2025',
    thumb: require('@tera/assets/app/element_71.png'),
  },
  {
    id: '3',
    index: '03',
    title: 'Colors around us',
    unit: 'Unit 2: My School',
    duration: '45 phút',
    status: 'done',
    date: '14/05/2025',
    thumb: require('@tera/assets/app/element_72.png'),
  },
  {
    id: '4',
    index: '04',
    title: 'School things',
    unit: 'Unit 2: My School',
    duration: '45 phút',
    status: 'upcoming',
    date: '17/05/2025',
    thumb: require('@tera/assets/app/element_73.png'),
  },
  {
    id: '5',
    index: '05',
    title: 'This is my family',
    unit: 'Unit 3: My Family',
    duration: '45 phút',
    status: 'none',
    date: '19/05/2025',
    thumb: require('@tera/assets/app/element_74.png'),
  },
  {
    id: '6',
    index: '06',
    title: 'Food and drinks',
    unit: 'Unit 3: My Family',
    duration: '45 phút',
    status: 'none',
    date: '21/05/2025',
    thumb: require('@tera/assets/app/element_75.png'),
  },
];

export default function LessonPlanScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState<TabType>('plan');

  const renderHeaderComponents = () => (
    <View>
      <View
        style={[
          styles.headerBackground,
          {
            marginTop: 0,
            borderRadius: 0,
            borderBottomLeftRadius: 24,
            borderBottomRightRadius: 24,
          },
        ]}
      >
        <Image
          source={require('@tera/assets/app/element_46.png')}
          style={styles.headerBackgroundMask}
          resizeMode="cover"
        />
        <View style={styles.headerTopRow}>
          <IconButton
            icon={({ size, color }) => (
              <Icon source="chevron-left" size={size} color={color} />
            )}
            iconColor="#FFF"
            size={32}
            onPress={() => {}}
          />
          <Text style={styles.headerTitle}>Giáo án</Text>
          <IconButton
            icon={({ size, color }) => (
              <Icon source="calendar-range" size={size} color={color} />
            )}
            iconColor="#FFF"
            size={32}
            onPress={() => {}}
          />
        </View>
      </View>

      <View style={{ paddingHorizontal: 16 }}>
        <ClassHeader
          className="Starters 2A"
          level="Beginner"
          room="Phòng 201"
          branch="Cơ sở 1"
          onChangeClass={() => {}}
        />
        <LessonTabs
          activeTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
        />
        <StatisticCards />
        <View style={styles.searchRow}>
          <Searchbar
            placeholder="Tìm kiếm theo tên bài học, chủ đề..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.searchBar}
            inputStyle={{ minHeight: 0 }}
            icon={({ size, color }) => (
              <Icon source="magnify" size={size} color={color} />
            )}
          />
          <Button
            mode="outlined"
            style={styles.btnFilter}
            labelStyle={{ color: '#007AFF' }}
            icon={({ size, color }) => (
              <Icon source="filter-variant" size={size} color="#007AFF" />
            )}
          >
            Bộ lọc
          </Button>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlashList
        data={MOCK_LESSONS}
        renderItem={({ item }) => (
          <View style={styles.renderItemContainer}>
            <LessonItem
              item={item}
              onPress={() => console.log(`Detail ${item.id}`)}
            />
          </View>
        )}
        ListHeaderComponent={renderHeaderComponents}
        ListFooterComponent={<QuickCreateBanner onCreate={() => {}} />}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
