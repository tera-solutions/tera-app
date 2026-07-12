import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { LessonRow } from '../types';
import { LESSON_STATUS_CONFIG } from '../constants';
import { styles } from '../styles';

interface Props {
  lessons: LessonRow[];
}

const SIZE = 84;
const STROKE = 9;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const STATUS_ORDER: LessonRow['status'][] = ['completed', 'ongoing', 'upcoming', 'cancelled'];

export default function ProgressCard({ lessons }: Props) {
  const total = lessons.length;
  const completed = lessons.filter((l) => l.status === 'completed').length;
  const rate = total ? Math.round((completed / total) * 100) : 0;
  const pct = rate / 100;
  const offset = CIRCUMFERENCE * (1 - pct);

  const legend = STATUS_ORDER.map((status) => ({
    status,
    ...LESSON_STATUS_CONFIG[status],
    value: lessons.filter((l) => l.status === status).length,
  }));

  return (
    <View style={styles.progressCard}>
      <Text style={styles.sectionTitle}>Tiến độ giảng dạy</Text>

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
}
