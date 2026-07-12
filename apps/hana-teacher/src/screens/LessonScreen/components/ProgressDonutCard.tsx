import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

import { ACTIVITY_STATUS_CONFIG } from '../constants';
import type { LessonActivity, LessonActivityStatus } from '../types';
import { styles } from '../styles';

interface Props {
  activities: LessonActivity[];
}

const SIZE = 76;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_ORDER: LessonActivityStatus[] = ['completed', 'in_progress', 'pending'];

export const ProgressDonutCard = ({ activities }: Props) => {
  const total = activities.length;
  const completed = activities.filter((a) => a.status === 'completed').length;
  const rate = total ? Math.round((completed / total) * 100) : 0;
  const offset = CIRCUMFERENCE * (1 - rate / 100);

  const legend = STATUS_ORDER.map((status) => ({
    status,
    ...ACTIVITY_STATUS_CONFIG[status],
    value: activities.filter((a) => a.status === status).length,
  }));

  return (
    <View style={styles.sidebarCard}>
      <View style={styles.sectionTitleRow}>
        <Icon source="chart-donut" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Tiến độ bài học</Text>
      </View>

      <View style={[styles.progressRow, { marginTop: 12 }]}>
        <View style={styles.progressChartWrapper}>
          <Svg width={SIZE} height={SIZE}>
            <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS} stroke="#E2E8F0" strokeWidth={STROKE} fill="none" />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#27AE60"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={offset}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2},${SIZE / 2}`}
            />
          </Svg>
          <View style={styles.progressChartLabel}>
            <Text style={styles.progressChartPct}>{rate}%</Text>
          </View>
        </View>

        <View style={styles.progressLegend}>
          {legend.map((item) => (
            <View key={item.status} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};
