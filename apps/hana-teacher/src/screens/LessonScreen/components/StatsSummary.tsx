import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { LessonStats } from '../types';

interface Props {
  stats?: LessonStats;
}

export const StatsSummary = ({ stats }: Props) => {
  const STATS = [
    { id: '1', icon: 'book-open-variant',    value: String(stats?.total ?? 0),     label: 'Tổng buổi',  bg: '#EBF5FF', color: '#007AFF' },
    { id: '2', icon: 'check-circle-outline', value: String(stats?.completed ?? 0), label: 'Đã giảng',   bg: '#EBF7EE', color: '#27AE60' },
    { id: '3', icon: 'clock-outline',        value: String(stats?.upcoming ?? 0),  label: 'Sắp tới',    bg: '#FFF4EB', color: '#E67E22' },
    { id: '4', icon: 'play-circle-outline',  value: String(stats?.ongoing ?? 0),   label: 'Đang học',   bg: '#F5EFFF', color: '#9B5DE5' },
  ];

  return (
    <View style={styles.statsContainer}>
      {STATS.map((stat) => (
        <View key={stat.id} style={[styles.statBox, { backgroundColor: stat.bg }]}>
          <Icon source={stat.icon} size={28} color={stat.color} />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};
