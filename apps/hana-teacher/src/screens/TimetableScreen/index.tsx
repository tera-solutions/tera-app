import React from 'react';
import { ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import TimetableHeader from './components/TimetableHeader';
import WeekSelector from './components/WeekSelector';
import SummaryCard from './components/SummaryCard';
import SessionSection from './components/SessionSection';
import SyncCalendarCard from './components/SyncCalendarCard';
import QuickActionGrid from './components/QuickActionGrid';

import { styles } from './styles';
import { AFTERNOON_CLASSES, EVENING_CLASSES, MORNING_CLASSES } from './data';

export default function TimetableScreen() {
  return (
    <View style={styles.container}>
      <TimetableHeader />
      <WeekSelector />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.summaryContainer}>
          <SummaryCard
            value={24}
            label="Tổng buổi học"
            valueColor="#2563EB"
            iconBackgroundColor="#DBEAFE"
            icon={<Ionicons name="book-outline" size={24} color="#2563EB" />}
          />

          <SummaryCard
            value={18}
            label="Đã hoàn thành"
            valueColor="#22C55E"
            iconBackgroundColor="#DCFCE7"
            icon={
              <Ionicons
                name="checkmark-circle-outline"
                size={24}
                color="#22C55E"
              />
            }
          />

          <SummaryCard
            value={4}
            label="Sắp diễn ra"
            valueColor="#F59E0B"
            iconBackgroundColor="#FEF3C7"
            icon={<Ionicons name="time-outline" size={24} color="#F59E0B" />}
          />

          <SummaryCard
            value={2}
            label="Đã hủy"
            valueColor="#8B5CF6"
            iconBackgroundColor="#EDE9FE"
            icon={
              <Ionicons name="calendar-outline" size={24} color="#8B5CF6" />
            }
          />
        </View>

        <SessionSection
          title="Buổi sáng"
          icon="sunny-outline"
          data={MORNING_CLASSES}
          onItemPress={(item) => {
            console.log(item);
          }}
        />

        <SessionSection
          title="Buổi chiều"
          icon="partly-sunny-outline"
          data={AFTERNOON_CLASSES}
          onItemPress={(item) => {
            console.log(item);
          }}
        />

        <SessionSection
          title="Buổi tối"
          icon="moon-outline"
          data={EVENING_CLASSES}
          onItemPress={(item) => {
            console.log(item);
          }}
        />

        <SyncCalendarCard
          onPress={() => {
            console.log('sync calendar');
          }}
        />

        <QuickActionGrid
          onActionPress={(action) => {
            console.log(action);
          }}
        />

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}
