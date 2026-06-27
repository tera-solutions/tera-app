import { Text, TouchableOpacity, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { GradeReport } from '../../types';
import { styles } from '../../styles';

interface Props {
  report: GradeReport;
}

const SIZE = 90;
const STROKE = 10;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ResultsReport({ report }: Props) {
  const pct = report.avgPercent / 100;
  const offset = CIRCUMFERENCE * (1 - pct);

  return (
    <View style={styles.reportSection}>
      <View style={styles.reportHeader}>
        <Text style={styles.reportTitle}>Báo cáo kết quả</Text>
        <TouchableOpacity>
          <Text style={styles.reportLink}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.reportCard}>
        {/* Donut chart */}
        <View style={styles.reportChartWrapper}>
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#E2E8F0"
              strokeWidth={STROKE}
              fill="none"
            />
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke="#2196F3"
              strokeWidth={STROKE}
              fill="none"
              strokeDasharray={`${pct * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={0}
              strokeLinecap="round"
              rotation="-90"
              origin={`${SIZE / 2},${SIZE / 2}`}
            />
          </Svg>
          <View style={styles.reportChartLabel}>
            <Text style={styles.reportChartPct}>{report.avgPercent}%</Text>
            <Text style={styles.reportChartCaption}>Điểm trung bình</Text>
          </View>
        </View>

        {/* Grade list */}
        <View style={styles.gradeList}>
          {report.grades.map((g) => (
            <View key={g.label} style={styles.gradeRow}>
              <Text style={styles.gradeLabel}>
                {g.label} ({g.range})
              </Text>
              <View style={styles.gradeBarTrack}>
                <View
                  style={[
                    styles.gradeBarFill,
                    { width: `${g.percent}%`, backgroundColor: g.color },
                  ]}
                />
              </View>
              <Text style={styles.gradeCount}>
                {g.percent}% ({g.count} HS)
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
