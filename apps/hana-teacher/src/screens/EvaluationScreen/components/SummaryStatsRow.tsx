import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import type { EvaluationSummary } from '../types';

interface Props {
  summary: EvaluationSummary;
  isLoading: boolean;
}

export const SummaryStatsRow = ({ summary, isLoading }: Props) => {
  const items = [
    { icon: 'account-group-outline', color: '#007AFF', value: String(summary.totalStudents), label: 'Học viên' },
    { icon: 'check-decagram-outline', color: '#27AE60', value: `${summary.evaluatedRate}%`, label: 'Đã đánh giá' },
    { icon: 'message-text-outline', color: '#9B5DE5', value: String(summary.totalComments), label: 'Nhận xét' },
    { icon: 'star-outline', color: '#E67E22', value: summary.avgRating ?? '—', label: 'Đánh giá TB' },
    { icon: 'emoticon-happy-outline', color: '#06B6D4', value: `${summary.satisfactionRate}%`, label: 'Hài lòng' },
  ];

  return (
    <View style={styles.statsRow}>
      {items.map((item) => (
        <View key={item.label} style={styles.statCard}>
          <Icon source={item.icon} size={18} color={item.color} />
          {isLoading ? (
            <ActivityIndicator size={12} style={{ marginTop: 4 }} />
          ) : (
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
          )}
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};
