import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';

import { styles } from '../styles';
import { MEDAL_COLOR } from '../constants';
import type { RankingRow } from '../types';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

interface Props {
  top3: RankingRow[];
}

export const Top3Card = ({ top3 }: Props) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Top 3</Text>
    {top3.length === 0 ? (
      <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
    ) : (
      top3.map((row, i) => (
        <View key={row.studentId} style={styles.top3Row}>
          <View style={[styles.medalBadge, { backgroundColor: MEDAL_COLOR[i] }]}>
            <Text style={styles.medalText}>{i + 1}</Text>
          </View>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarText}>{initialOf(row.studentName)}</Text>
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={styles.top3Name} numberOfLines={1}>
              {row.studentName}
            </Text>
            <Text style={styles.top3Class} numberOfLines={1}>
              {row.className || '—'}
            </Text>
          </View>
          <Text style={styles.top3Score}>{row.score}</Text>
        </View>
      ))
    )}
  </View>
);
