import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

const STATS = [
  { id: '1', icon: 'book-open-variant', value: '5', label: 'Mục tiêu', bg: '#EBF5FF', color: '#007AFF' },
  { id: '2', icon: 'format-list-bulleted', value: '4', label: 'Hoạt động', bg: '#EBF7EE', color: '#27AE60' },
  { id: '3', icon: 'clock-outline', value: '45', label: 'Thời gian', bg: '#FFF4EB', color: '#E67E22' },
  { id: '4', icon: 'target', value: '80%', label: 'Mức độ đạt', bg: '#F5EFFF', color: '#9B5DE5' },
];

export const StatsSummary = () => (
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