import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { AssignmentStats } from '../types';

interface Props {
  stats?: AssignmentStats;
}

export const MetricsSummary = ({ stats }: Props) => {
  const METRICS = [
    {
      id: '1',
      value: String(stats?.total ?? 0),
      label: 'Đã giao',
      icon: 'file-document-outline',
      color: '#007AFF',
    },
    {
      id: '2',
      value: String(stats?.published ?? 0),
      label: 'Đang mở',
      icon: 'check-circle-outline',
      color: '#27AE60',
    },
    {
      id: '3',
      value: String(stats?.draft ?? 0),
      label: 'Bản nháp',
      icon: 'clock-outline',
      color: '#E67E22',
    },
    {
      id: '4',
      value: String(stats?.closed ?? 0),
      label: 'Đã đóng',
      icon: 'chart-pie',
      color: '#9B5DE5',
    },
  ];

  return (
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
};
