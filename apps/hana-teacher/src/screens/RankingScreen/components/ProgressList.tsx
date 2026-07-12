import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import type { ProgressRow } from '../types';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

interface Props {
  rows: ProgressRow[];
  isLoading: boolean;
}

export const ProgressList = ({ rows, isLoading }: Props) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Tiến bộ theo tháng</Text>
    {isLoading ? (
      <ActivityIndicator style={{ paddingVertical: 24 }} />
    ) : rows.length === 0 ? (
      <Text style={styles.emptyText}>Chưa đủ dữ liệu 2 kỳ liên tiếp để so sánh tiến bộ</Text>
    ) : (
      rows.map((row) => {
        const positive = row.deltaPct >= 0;
        return (
          <View key={row.studentId} style={styles.progressRow}>
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initialOf(row.studentName)}</Text>
            </View>
            <Text style={{ flex: 1, fontSize: 13, fontWeight: '600', color: '#0F172A' }} numberOfLines={1}>
              {row.studentName}
            </Text>
            <View style={styles.progressScoreCol}>
              <Text style={styles.progressScoreLabel}>Kỳ trước</Text>
              <Text style={styles.progressScoreValue}>{row.prevMonthScore?.toFixed(1)}</Text>
            </View>
            <View style={styles.progressScoreCol}>
              <Text style={styles.progressScoreLabel}>Kỳ này</Text>
              <Text style={styles.progressScoreValue}>{row.currMonthScore?.toFixed(1)}</Text>
            </View>
            <View style={styles.deltaBadge}>
              <Icon
                source={positive ? 'trending-up' : 'trending-down'}
                size={16}
                color={positive ? '#27AE60' : '#EF4444'}
              />
              <Text style={[styles.deltaText, { color: positive ? '#27AE60' : '#EF4444' }]}>
                {positive ? '+' : ''}
                {row.deltaPct}%
              </Text>
            </View>
          </View>
        );
      })
    )}
  </View>
);
