import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import type { RankingSummary } from '../types';

interface Props {
  summary: RankingSummary;
  isLoading: boolean;
}

export const SummaryStats = ({ summary, isLoading }: Props) => {
  const items = [
    { icon: 'account-group-outline', color: '#007AFF', value: String(summary.totalStudents), label: 'Tổng HV' },
    { icon: 'chart-bar', color: '#9B5DE5', value: summary.avgScore || '—', label: 'Điểm TB' },
    { icon: 'school-outline', color: '#27AE60', value: String(summary.totalClasses), label: 'Tổng lớp' },
    {
      icon: 'check-decagram-outline',
      color: '#E67E22',
      value: `${summary.goodRate}%`,
      label: 'Tỷ lệ khá giỏi',
      sublabel: 'Điểm từ 8 trở lên',
    },
  ];

  return (
    <View style={styles.statsRow}>
      {items.map((item) => (
        <View key={item.label} style={styles.statCard}>
          <Icon source={item.icon} size={20} color={item.color} />
          {isLoading ? (
            <ActivityIndicator size={14} style={{ marginTop: 4 }} />
          ) : (
            <Text style={[styles.statValue, { color: item.color }]}>{item.value}</Text>
          )}
          <Text style={styles.statLabel}>{item.label}</Text>
          {!!item.sublabel && <Text style={styles.statSublabel}>{item.sublabel}</Text>}
        </View>
      ))}
    </View>
  );
};
