import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { ChevronRight } from 'lucide-react-native';

import { AttendanceSummary } from '../../types';
import { styles } from '../../styles';

interface Props {
  summary: AttendanceSummary;
}

const SIZE = 80;
const STROKE = 8;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const LEGEND = (s: AttendanceSummary) => [
  { label: 'Có mặt', value: s.present, color: '#22C55E' },
  { label: 'Vắng', value: s.absent, color: '#F59E0B' },
  { label: 'Nghỉ phép', value: s.excused, color: '#CBD5E1' },
];

export default function AttendanceCard({ summary }: Props) {
  const pct = summary.total > 0 ? summary.present / summary.total : 0;
  const offset = CIRCUMFERENCE * (1 - pct);
  const legend = LEGEND(summary);

  return (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Điểm danh hôm nay</Text>

      <View style={styles.attendanceRow}>
        {/* Donut chart */}
        <View style={styles.attendanceChartWrapper}>
          <Svg width={SIZE} height={SIZE}>
            {/* Background track */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#E2E8F0"
              strokeWidth={STROKE}
              fill="none"
            />
            {/* Absent (yellow) segment */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#F59E0B"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${(summary.absent / summary.total) * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={-((summary.present / summary.total) * CIRCUMFERENCE)}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2},${SIZE / 2}`}
            />
            {/* Present (green) segment */}
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#22C55E"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${pct * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2},${SIZE / 2}`}
            />
          </Svg>
          <View style={styles.attendanceChartLabel}>
            <Text style={styles.attendanceChartValue}>
              {summary.present}/{summary.total}
            </Text>
            <Text style={styles.attendanceChartPct}>
              {Math.round(pct * 100)}%
            </Text>
          </View>
        </View>

        {/* Legend */}
        <View style={styles.attendanceLegend}>
          {legend.map((item) => (
            <View key={item.label} style={styles.legendRow}>
              <View style={[styles.legendDot, { backgroundColor: item.color }]} />
              <Text style={styles.legendLabel}>{item.label}</Text>
              <Text style={styles.legendValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.attendanceFooter}>
        <Text style={styles.sectionLink}>Xem chi tiết</Text>
        <ChevronRight size={14} color="#0066CC" />
      </TouchableOpacity>
    </View>
  );
}
