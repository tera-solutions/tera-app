import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import type { LessonDetail } from '../types';
import { styles } from '../styles';

interface Props {
  detail: LessonDetail;
}

export const StatRow = ({ detail }: Props) => {
  const STATS = [
    { id: '1', icon: 'book-open-variant', value: String(detail.objectives.length), label: 'Mục tiêu', bg: '#EBF5FF', color: '#007AFF' },
    { id: '2', icon: 'format-list-bulleted', value: String(detail.activities.length), label: 'Hoạt động', bg: '#EBF7EE', color: '#27AE60' },
    { id: '3', icon: 'clock-outline', value: String(detail.duration), label: 'Số phút', bg: '#FFF4EB', color: '#E67E22' },
    { id: '4', icon: 'check-decagram-outline', value: `${detail.completion_rate}%`, label: 'Mức độ đạt', bg: '#F5EFFF', color: '#9B5DE5' },
  ];

  return (
    <View style={styles.statsContainer}>
      {STATS.map((stat) => (
        <View key={stat.id} style={[styles.statBox, { backgroundColor: stat.bg }]}>
          <Icon source={stat.icon} size={22} color={stat.color} />
          <Text style={styles.statValue}>{stat.value}</Text>
          <Text style={styles.statLabel}>{stat.label}</Text>
        </View>
      ))}
    </View>
  );
};
