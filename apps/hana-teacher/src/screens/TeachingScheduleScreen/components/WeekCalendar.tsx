import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import type { WeekDay } from '../types';

interface WeekCalendarProps {
  weekDays: WeekDay[];
  selectedDate: string;
  headerLabel: string;
  onSelectDate: (date: string) => void;
  onToday: () => void;
  onPrevWeek: () => void;
  onNextWeek: () => void;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  weekDays,
  selectedDate,
  headerLabel,
  onSelectDate,
  onToday,
  onPrevWeek,
  onNextWeek,
}) => {
  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity onPress={onPrevWeek} hitSlop={8} activeOpacity={0.7}>
            <Icon source="chevron-left" size={16} color="#007AFF" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.btnToday} onPress={onToday} activeOpacity={0.7}>
            <Text style={styles.todayText}>Hôm nay</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.dateSelector}>
          <Text style={styles.dateSelectorText}>{headerLabel}</Text>
        </View>

        <TouchableOpacity onPress={onNextWeek} hitSlop={8} activeOpacity={0.7}>
          <Icon source="chevron-right" size={20} color="#64748B" />
        </TouchableOpacity>
      </View>

      <View style={styles.daysRow}>
        {weekDays.map((day) => {
          const isActive = selectedDate === day.fullDate;
          return (
            <TouchableOpacity
              key={day.fullDate}
              style={[styles.dayItem, isActive && styles.activeDayItem]}
              onPress={() => onSelectDate(day.fullDate)}
              activeOpacity={0.8}
            >
              <Text style={[styles.dayLabel, isActive && styles.activeDayLabel]}>{day.label}</Text>
              <Text style={[styles.dayNumber, isActive && styles.activeDayNumber]}>{day.number}</Text>
              {isActive ? (
                <View style={[styles.activeIndicatorDot, { backgroundColor: '#FFF' }]} />
              ) : day.isToday ? (
                <View style={styles.activeIndicatorDot} />
              ) : (
                <View style={{ height: 4, marginTop: 4 }} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
