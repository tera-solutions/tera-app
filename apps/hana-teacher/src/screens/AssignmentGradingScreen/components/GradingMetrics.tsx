import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

const METRICS = [
  {
    id: '1',
    value: '22',
    label: 'Tổng số bài',
    icon: 'file-document-outline',
    color: '#007AFF',
  },
  {
    id: '2',
    value: '20',
    label: 'Đã nộp',
    icon: 'check-circle-outline',
    color: '#27AE60',
  },
  {
    id: '3',
    value: '2',
    label: 'Chưa nộp',
    icon: 'clock-outline',
    color: '#E67E22',
  },
  {
    id: '4',
    value: '90.9%',
    label: 'Tỉ lệ hoàn thành',
    icon: 'chart-pie',
    color: '#9B5DE5',
  },
];

export const GradingMetrics = () => (
  <View style={styles.metricsContainer}>
    {METRICS.map((item) => (
      <View key={item.id} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Icon source={item.icon} size={26} color={item.color} />
        </View>
        <Text style={[styles.metricValue, { color: item.color }]}>
          {item.value}
        </Text>
        <Text style={styles.metricLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);
