import React from 'react';
import { View, Text } from 'react-native';
import { styles } from '../styles';
import { MaterialStats } from '../types';

interface Props {
  stats: MaterialStats;
}

export const MaterialStatsRow = ({ stats }: Props) => (
  <View style={styles.statsCard}>
    <View style={styles.statItem}>
      <Text style={styles.statValue}>{stats.total}</Text>
      <Text style={styles.statLabel}>Tổng</Text>
    </View>
    <View style={styles.statDivider} />
    <View style={styles.statItem}>
      <Text style={[styles.statValue, styles.statValueBlue]}>{stats.hoc_lieu}</Text>
      <Text style={styles.statLabel}>Học liệu</Text>
    </View>
    <View style={styles.statDivider} />
    <View style={styles.statItem}>
      <Text style={[styles.statValue, styles.statValueGreen]}>{stats.tai_lieu}</Text>
      <Text style={styles.statLabel}>Tài liệu</Text>
    </View>
    <View style={styles.statDivider} />
    <View style={styles.statItem}>
      <Text style={[styles.statValue, styles.statValuePurple]}>{stats.da_phuong_tien}</Text>
      <Text style={styles.statLabel}>Đa phương tiện</Text>
    </View>
  </View>
);
