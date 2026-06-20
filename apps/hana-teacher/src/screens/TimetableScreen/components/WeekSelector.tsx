import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles';

interface DayItem {
  id: string;
  day: string;
  date: string;
}

const DAYS: DayItem[] = [
  {
    id: '1',
    day: 'T2',
    date: '12',
  },
  {
    id: '2',
    day: 'T3',
    date: '13',
  },
  {
    id: '3',
    day: 'T4',
    date: '14',
  },
  {
    id: '4',
    day: 'T5',
    date: '15',
  },
  {
    id: '5',
    day: 'T6',
    date: '16',
  },
  {
    id: '6',
    day: 'T7',
    date: '17',
  },
  {
    id: '7',
    day: 'CN',
    date: '18',
  },
];

interface WeekSelectorProps {
  weekLabel?: string;
  selectedDay?: string;
  onDayChange?: (day: DayItem) => void;
  onFilterPress?: () => void;
}

export default function WeekSelector({
  weekLabel = '12/05 - 18/05/2025',
  selectedDay = '4',
  onDayChange,
  onFilterPress,
}: WeekSelectorProps) {
  const [activeDay, setActiveDay] = useState(selectedDay);

  const handleSelectDay = (item: DayItem) => {
    setActiveDay(item.id);
    onDayChange?.(item);
  };

  return (
    <View style={styles.weekContainer}>
      <View style={styles.weekToolbar}>
        <TouchableOpacity activeOpacity={0.8} style={styles.dateButton}>
          <Text style={styles.dateText}>{weekLabel}</Text>
        </TouchableOpacity>

        <TouchableOpacity activeOpacity={0.8} style={styles.weekButton}>
          <Text style={styles.filterText}>Tuần này</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.filterButton}
          onPress={onFilterPress}
        >
          <Ionicons name="options-outline" size={18} color="#0066cc" />
        </TouchableOpacity>
      </View>

      <View style={styles.dayList}>
        {DAYS.map((item) => {
          const isActive = activeDay === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              style={[styles.dayItem, isActive && styles.dayItemActive]}
              onPress={() => handleSelectDay(item)}
            >
              <Text style={[styles.dayName, isActive && styles.dayNameActive]}>
                {item.day}
              </Text>

              <Text style={[styles.dayDate, isActive && styles.dayDateActive]}>
                {item.date}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
