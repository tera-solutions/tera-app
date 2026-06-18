import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { styles } from '../styles';

interface DayData {
  label: string;
  number: string;
  fullDate: string;
}

interface WeekCalendarProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export const WeekCalendar: React.FC<WeekCalendarProps> = ({
  selectedDate,
  onDateSelect,
}) => {
  const days: DayData[] = [
    { label: 'T2', number: '12', fullDate: '2025-05-12' },
    { label: 'T3', number: '13', fullDate: '2025-05-13' },
    { label: 'T4', number: '14', fullDate: '2025-05-14' },
    { label: 'T5', number: '15', fullDate: '2025-05-15' },
    { label: 'T6', number: '16', fullDate: '2025-05-16' },
    { label: 'T7', number: '17', fullDate: '2025-05-17' },
    { label: 'CN', number: '18', fullDate: '2025-05-18' },
  ];

  return (
    <View style={styles.calendarCard}>
      <View style={styles.calendarHeader}>
        <TouchableOpacity style={styles.btnToday} activeOpacity={0.7}>
          <Icon source="chevron-left" size={16} color="#007AFF" />
          <Text style={styles.todayText}>Hôm nay</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateSelector} activeOpacity={0.7}>
          <Text style={styles.dateSelectorText}>Thứ 5, 15/05/2025</Text>
          <Icon source="chevron-down" size={16} color="#0F172A" />
        </TouchableOpacity>

        <Icon source="chevron-right" size={20} color="#64748B" />
      </View>

      <View style={styles.daysRow}>
        {days.map((day, idx) => {
          const isActive = selectedDate === day.fullDate;
          return (
            <TouchableOpacity
              key={idx}
              style={[styles.dayItem, isActive && styles.activeDayItem]}
              onPress={() => onDateSelect(day.fullDate)}
              activeOpacity={0.8}
            >
              <Text
                style={[styles.dayLabel, isActive && styles.activeDayLabel]}
              >
                {day.label}
              </Text>
              <Text
                style={[styles.dayNumber, isActive && styles.activeDayNumber]}
              >
                {day.number}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.activeIndicatorDot,
                    { backgroundColor: '#FFF' },
                  ]}
                />
              )}
              {!isActive && day.number === '15' && (
                <View style={styles.activeIndicatorDot} />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
