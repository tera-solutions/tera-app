import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '../styles';

const LABELS = ['0-2.5', '2.5-5', '5-7.5', '7.5-10'];

interface Props {
  buckets: [number, number, number, number];
}

export const ScoreHistogramCard = ({ buckets }: Props) => {
  const maxBucket = Math.max(...buckets, 1);

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Thống kê điểm</Text>
      {buckets.map((count, i) => (
        <View key={LABELS[i]} style={styles.histBarRow}>
          <Text style={styles.histBarLabel}>{LABELS[i]}</Text>
          <View style={styles.histBarTrack}>
            <View style={[styles.histBarFill, { width: `${(count / maxBucket) * 100}%` }]} />
          </View>
          <Text style={styles.histBarCount}>{count}</Text>
        </View>
      ))}
    </View>
  );
};
