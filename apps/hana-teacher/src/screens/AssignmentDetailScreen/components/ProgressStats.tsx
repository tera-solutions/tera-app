import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import type { AssignmentDetailData } from '../types';

interface Props {
  progress: AssignmentDetailData['progress'];
}

export const ProgressStats = ({ progress }: Props) => {
  const items = [
    { icon: 'account-group-outline', color: '#007AFF', value: progress.total, label: 'Tổng học viên' },
    { icon: 'clipboard-text-outline', color: '#9B5DE5', value: progress.submitted, label: 'Đã nộp' },
    { icon: 'check-circle-outline', color: '#27AE60', value: progress.graded, label: 'Đã chấm' },
    { icon: 'clock-outline', color: '#E67E22', value: progress.pending, label: 'Chưa nộp' },
  ];

  return (
    <View style={styles.metricsRow}>
      {items.map((item) => (
        <View key={item.label} style={styles.metricCard}>
          <Icon source={item.icon} size={22} color={item.color} />
          <Text style={[styles.metricValue, { color: item.color }]}>{item.value}</Text>
          <Text style={styles.metricLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};
