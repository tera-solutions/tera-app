import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import { isGraded, scoreBuckets } from '../_utils';
import type { SubmissionRow } from '../types';

interface Props {
  rows: SubmissionRow[];
  maxScore: number;
}

export const ResultStats = ({ rows, maxScore }: Props) => {
  const gradedCount = rows.filter((r) => isGraded(r.status)).length;
  const ungradedCount = rows.length - gradedCount;
  const buckets = scoreBuckets(rows, maxScore);
  const step = maxScore / 4;
  const maxBucket = Math.max(...buckets, 1);

  return (
    <View style={styles.statsContainer}>
      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Tổng quan</Text>
        <View style={styles.statsSummaryRow}>
          <View style={[styles.statsSummaryBox, { backgroundColor: '#E2FBEB' }]}>
            <Text style={[styles.statsSummaryValue, { color: '#27AE60' }]}>{gradedCount}</Text>
            <Text style={styles.statsSummaryLabel}>Đã chấm</Text>
          </View>
          <View style={[styles.statsSummaryBox, { backgroundColor: '#FFF4EB' }]}>
            <Text style={[styles.statsSummaryValue, { color: '#E67E22' }]}>{ungradedCount}</Text>
            <Text style={styles.statsSummaryLabel}>Chưa chấm</Text>
          </View>
        </View>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsCardTitle}>Phân bố điểm</Text>
        {buckets.map((count, i) => (
          <View key={i} style={styles.statsBarRow}>
            <Text style={styles.statsBarLabel}>
              {Math.round(i * step)}-{Math.round((i + 1) * step)}
            </Text>
            <View style={styles.statsBarTrack}>
              <View style={[styles.statsBarFill, { width: `${(count / maxBucket) * 100}%` }]} />
            </View>
            <Text style={styles.statsBarCount}>{count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};
