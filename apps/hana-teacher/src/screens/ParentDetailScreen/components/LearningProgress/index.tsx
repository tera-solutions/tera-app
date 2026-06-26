import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { ProgressPoint } from '../../types';
import { styles } from '../../styles';

interface Props {
  points: ProgressPoint[];
  period?: string;
}

const CHART_W = 280;
const CHART_H = 100;
const PAD_L = 0;
const PAD_B = 20;
const PAD_T = 8;

export default function LearningProgress({ points, period = '7 ngày qua' }: Props) {
  const n = points.length;
  const xStep = n > 1 ? (CHART_W - PAD_L) / (n - 1) : CHART_W;
  const yRange = CHART_H - PAD_B - PAD_T;

  const toX = (i: number) => PAD_L + i * xStep;
  const toY = (pct: number) => CHART_H - PAD_B - (pct / 100) * yRange;

  const polyPoints = points.map((p, i) => `${toX(i)},${toY(p.percent)}`).join(' ');

  return (
    <View style={styles.sectionCard}>
      <View style={styles.progressHeader}>
        <Text style={styles.sectionTitle}>Tiến độ học tập</Text>
        <TouchableOpacity style={styles.periodSelector}>
          <Text style={styles.periodText}>{period}</Text>
          <ChevronDown size={14} color="#475569" />
        </TouchableOpacity>
      </View>

      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.chartYAxis}>
          {[100, 75, 50, 25, 0].map((v) => (
            <Text key={v} style={styles.chartYLabel}>{v}%</Text>
          ))}
        </View>

        {/* SVG chart */}
        <View style={styles.chartBody}>
          <Svg width="100%" height={CHART_H} viewBox={`0 0 ${CHART_W} ${CHART_H}`}>
            {/* Horizontal gridlines */}
            {[0, 25, 50, 75, 100].map((pct) => (
              <Line
                key={pct}
                x1={0}
                y1={toY(pct)}
                x2={CHART_W}
                y2={toY(pct)}
                stroke="#E2E8F0"
                strokeWidth={1}
              />
            ))}

            {/* Line */}
            <Polyline
              points={polyPoints}
              fill="none"
              stroke="#0066CC"
              strokeWidth={2.5}
              strokeLinejoin="round"
              strokeLinecap="round"
            />

            {/* Dots */}
            {points.map((p, i) => (
              <Circle
                key={i}
                cx={toX(i)}
                cy={toY(p.percent)}
                r={4}
                fill="#0066CC"
                stroke="#FFFFFF"
                strokeWidth={2}
              />
            ))}

            {/* X-axis date labels */}
            {points.map((p, i) => (
              <SvgText
                key={p.date}
                x={toX(i)}
                y={CHART_H - 4}
                textAnchor="middle"
                fontSize={9}
                fill="#94A3B8"
              >
                {p.date}
              </SvgText>
            ))}
          </Svg>
        </View>
      </View>
    </View>
  );
}
