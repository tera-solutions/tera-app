import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import type { ScheduleDayStats } from '../types';

interface Props {
  stats: ScheduleDayStats;
  periodLabel: string;
}

export const ScheduleStats: React.FC<Props> = ({ stats, periodLabel }) => {
  const items = [
    { label: 'Buổi dạy', value: String(stats.sessionsCount), icon: 'book-open-variant', color: '#3B82F6' },
    { label: 'Lớp học', value: String(stats.classesCount), icon: 'account-group-outline', color: '#10B981' },
    { label: 'Tổng thời gian', value: stats.totalHoursLabel, icon: 'clock-outline', color: '#F97316' },
    {
      label: 'Buổi đã dạy',
      value: String(stats.doneCount),
      icon: 'checkbox-marked-circle-outline',
      color: '#8B5CF6',
    },
  ];

  return (
    <View style={styles.statsGrid}>
      {items.map((item, idx) => (
        <View key={idx} style={[styles.statColumn, idx === items.length - 1 && { borderRightWidth: 0 }]}>
          <Icon source={item.icon} size={22} color={item.color} />
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
          <Text style={styles.statPeriod}>{periodLabel}</Text>
        </View>
      ))}
    </View>
  );
};
