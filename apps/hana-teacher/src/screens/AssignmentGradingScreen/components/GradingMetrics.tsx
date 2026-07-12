import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import type { AssignmentGradingHeader } from '../types';

interface Props {
  progress: AssignmentGradingHeader['progress'];
}

export const GradingMetrics = ({ progress }: Props) => {
  const { total, submitted, pending } = progress;
  const completionRate = total > 0 ? Math.round((submitted / total) * 100) : 0;

  const metrics = [
    { id: '1', value: String(total), label: 'Tổng số bài', icon: 'file-document-outline', color: '#007AFF' },
    { id: '2', value: String(submitted), label: 'Đã nộp', icon: 'check-circle-outline', color: '#27AE60' },
    { id: '3', value: String(pending), label: 'Chưa nộp', icon: 'clock-outline', color: '#E67E22' },
    { id: '4', value: `${completionRate}%`, label: 'Tỉ lệ nộp bài', icon: 'chart-pie', color: '#9B5DE5' },
  ];

  return (
    <View style={styles.metricsContainer}>
      {metrics.map((item) => (
        <View key={item.id} style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Icon source={item.icon} size={26} color={item.color} />
          </View>
          <Text style={[styles.metricValue, { color: item.color }]}>{item.value}</Text>
          <Text style={styles.metricLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};
