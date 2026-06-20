import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

const METRICS = [
  {
    id: '1',
    value: '28',
    label: 'Đã giao',
    icon: 'file-document-outline',
    color: '#007AFF',
  },
  {
    id: '2',
    value: '16',
    label: 'Đã nộp',
    icon: 'check-circle-outline',
    color: '#27AE60',
  },
  {
    id: '3',
    value: '8',
    label: 'Chưa nộp',
    icon: 'clock-outline',
    color: '#E67E22',
  },
  {
    id: '4',
    value: '85%',
    label: 'Tỉ lệ hoàn thành',
    icon: 'chart-pie',
    color: '#9B5DE5',
  },
];

export const MetricsSummary = () => (
  <View style={styles.metricsContainer}>
    {METRICS.map((item) => (
      <View key={item.id} style={styles.metricCard}>
        <View style={styles.metricHeader}>
          <Icon source={item.icon} size={24} color={item.color} />
          <Icon source="chevron-right" size={14} color="#CBD5E1" />
        </View>
        <Text style={[styles.metricValue, { color: item.color }]}>
          {item.value}
        </Text>
        <Text style={styles.metricLabel}>{item.label}</Text>
      </View>
    ))}
  </View>
);
