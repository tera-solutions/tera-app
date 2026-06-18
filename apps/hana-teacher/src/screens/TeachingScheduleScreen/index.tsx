import React, { useState } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { FlashList } from '@shopify/flash-list';

import { styles } from './styles';
import { WeekCalendar } from './components/WeekCalendar';
import { ScheduleStats } from './components/ScheduleStats';
import { ScheduleItem, ScheduleData } from './components/ScheduleItem';
import { WeeklyScheduleBanner } from './components/WeeklyScheduleBanner';

const MOCK_SCHEDULES: ScheduleData[] = [
  {
    id: '1',
    startTime: '08:00',
    endTime: '09:30',
    duration: '1.5 giờ',
    className: 'Starters 2A',
    classColor: { bg: '#EFF6FF', text: '#1D4ED8', indicator: '#3B82F6' },
    lessonName: 'Hello! – Getting to know you',
    room: 'Phòng 201',
    branch: 'Cơ sở 1',
    unit: 'Unit 1: My World',
    status: 'upcoming',
    students: '24/24',
    avatar: require('@tera/assets/app/element_77.png'),
  },
  {
    id: '2',
    startTime: '09:45',
    endTime: '11:15',
    duration: '1.5 giờ',
    className: 'Movers 1B',
    classColor: { bg: '#ECFDF5', text: '#047857', indicator: '#10B981' },
    lessonName: 'Numbers 1–10',
    room: 'Phòng 202',
    branch: 'Cơ sở 1',
    unit: 'Unit 1: My World',
    status: 'upcoming',
    students: '24/24',
    avatar: require('@tera/assets/app/element_78.png'),
  },
  {
    id: '3',
    startTime: '13:30',
    endTime: '15:00',
    duration: '1.5 giờ',
    className: 'Flyers 3A',
    classColor: { bg: '#FFF7ED', text: '#C2410C', indicator: '#F97316' },
    lessonName: 'Colors around us',
    room: 'Phòng 203',
    branch: 'Cơ sở 1',
    unit: 'Unit 2: My School',
    status: 'ongoing',
    students: '24/24',
    avatar: require('@tera/assets/app/element_79.png'),
  },
  {
    id: '4',
    startTime: '15:15',
    endTime: '16:45',
    duration: '1.5 giờ',
    className: 'Starters 2B',
    classColor: { bg: '#F5F3FF', text: '#6D28D9', indicator: '#8B5CF6' },
    lessonName: 'School things',
    room: 'Phòng 204',
    branch: 'Cơ sở 1',
    unit: 'Unit 2: My School',
    status: 'not_started',
    students: '20/24',
    avatar: require('@tera/assets/app/element_80.png'),
  },
];

export default function TeachingScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState('2025-05-15');

  const renderHeaderComponents = () => (
    <View>
      <View style={styles.headerBackground}>
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
            size={28}
            onPress={() => {}}
          />
          <Text style={styles.headerTitle}>Lịch dạy</Text>
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={({ size, color }) => (
                <Icon
                  source="calendar-month-outline"
                  size={size}
                  color={color}
                />
              )}
              iconColor="#FFF"
              size={24}
              onPress={() => {}}
            />
            <IconButton
              icon={({ size, color }) => (
                <Icon source="filter-variant" size={size} color={color} />
              )}
              iconColor="#FFF"
              size={24}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <WeekCalendar
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />
        <ScheduleStats />

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>Lịch dạy hôm nay</Text>
          <TouchableOpacity style={styles.btnSort} activeOpacity={0.7}>
            <Text style={styles.sortText}>Sắp xếp</Text>
            <Icon source="swap-vertical" size={16} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <FlashList
        data={MOCK_SCHEDULES}
        ListHeaderComponent={renderHeaderComponents}
        ListFooterComponent={
          <View style={{ paddingHorizontal: 16 }}>
            <WeeklyScheduleBanner />
          </View>
        }
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          // Chỉ tác động style căn lề vào vùng render item bài học
          <View style={styles.renderItemContainer}>
            <ScheduleItem item={item} />
          </View>
        )}
      />
    </View>
  );
}
