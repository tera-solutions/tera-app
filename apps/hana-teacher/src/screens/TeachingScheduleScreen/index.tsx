import React, { useMemo, useState } from 'react';
import { View, Text, StatusBar, Image, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Icon, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { FlashList } from '@shopify/flash-list';

import { TimetableService } from '@tera/modules/education';

import { styles } from './styles';
import { WeekCalendar } from './components/WeekCalendar';
import { ScheduleStats } from './components/ScheduleStats';
import { ScheduleItem } from './components/ScheduleItem';
import { WeeklyScheduleBanner } from './components/WeeklyScheduleBanner';
import { addDays, computeDayStats, formatDayHeader, getWeekDays, toDateKey, toScheduleSessions } from './_utils';
import type { ScheduleSession } from './types';

export default function TeachingScheduleScreen() {
  const router = useRouter();
  const [anchorDate, setAnchorDate] = useState(() => new Date());
  const [sortAsc, setSortAsc] = useState(true);

  const weekDays = useMemo(() => getWeekDays(anchorDate), [anchorDate]);
  const selectedDate = toDateKey(anchorDate);
  const isTodaySelected = selectedDate === toDateKey(new Date());

  const { data, isLoading, isFetching, refetch } = TimetableService.useTimetableCalendar({
    date_from: weekDays[0].fullDate,
    date_to: weekDays[6].fullDate,
  });
  const weekSessions = useMemo(() => toScheduleSessions(data?.data), [data]);

  const daySessions = useMemo<ScheduleSession[]>(
    () =>
      weekSessions
        .filter((s) => s.date === selectedDate)
        .sort((a, b) =>
          sortAsc ? a.startTime.localeCompare(b.startTime) : b.startTime.localeCompare(a.startTime),
        ),
    [weekSessions, selectedDate, sortAsc],
  );

  const dayStats = useMemo(() => computeDayStats(daySessions), [daySessions]);

  const goToday = () => setAnchorDate(new Date());
  const goPrevWeek = () => setAnchorDate((d) => addDays(d, -7));
  const goNextWeek = () => setAnchorDate((d) => addDays(d, 7));
  const selectDate = (dateStr: string) => setAnchorDate(new Date(`${dateStr}T00:00:00`));

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
            icon={({ size, color }) => <Icon source="chevron-left" size={size} color={color} />}
            iconColor="#FFF"
            size={28}
            onPress={() => router.back()}
          />
          <Text style={styles.headerTitle}>Lịch dạy</Text>
          <View style={{ flexDirection: 'row' }}>
            <IconButton
              icon={({ size, color }) => <Icon source="calendar-month-outline" size={size} color={color} />}
              iconColor="#FFF"
              size={24}
              onPress={goToday}
            />
            <IconButton
              icon={({ size, color }) => <Icon source="filter-variant" size={size} color={color} />}
              iconColor="#FFF"
              size={24}
              onPress={() => {}}
            />
          </View>
        </View>
      </View>
      <View style={{ paddingHorizontal: 16 }}>
        <WeekCalendar
          weekDays={weekDays}
          selectedDate={selectedDate}
          headerLabel={formatDayHeader(selectedDate)}
          onSelectDate={selectDate}
          onToday={goToday}
          onPrevWeek={goPrevWeek}
          onNextWeek={goNextWeek}
        />
        <ScheduleStats stats={dayStats} periodLabel={isTodaySelected ? 'Hôm nay' : 'Ngày đã chọn'} />

        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            {isTodaySelected ? 'Lịch dạy hôm nay' : `Lịch dạy ${formatDayHeader(selectedDate)}`}
          </Text>
          <TouchableOpacity style={styles.btnSort} activeOpacity={0.7} onPress={() => setSortAsc((v) => !v)}>
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
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      ) : (
        <FlashList
          data={daySessions}
          ListHeaderComponent={renderHeaderComponents}
          ListEmptyComponent={
            <View style={{ paddingHorizontal: 16, paddingVertical: 24 }}>
              <Text style={{ textAlign: 'center', color: '#94A3B8', fontSize: 13 }}>
                Không có lịch dạy {isTodaySelected ? 'hôm nay' : 'trong ngày này'}
              </Text>
            </View>
          }
          ListFooterComponent={
            <View style={{ paddingHorizontal: 16 }}>
              <WeeklyScheduleBanner />
            </View>
          }
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <View style={styles.renderItemContainer}>
              <ScheduleItem item={item} />
            </View>
          )}
        />
      )}
    </View>
  );
}
