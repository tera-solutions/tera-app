import { Text, View } from 'react-native';
import Svg, { Circle, Line, Polyline, Text as SvgText } from 'react-native-svg';

import { COLOR_COLLECTED, COLOR_OUTSTANDING, TrendPoint } from '../constants';
import { styles } from '../style';

interface Props {
  points: TrendPoint[];
  width: number;
  height?: number;
}

const formatShort = (v: number) => {
  if (v >= 1000000) return `${Math.round(v / 100000) / 10}M`;
  if (v >= 1000) return `${Math.round(v / 1000)}K`;
  return `${v}`;
};

const PADDING_LEFT = 34;
const PADDING_RIGHT = 8;
const PADDING_TOP = 10;
const PADDING_BOTTOM = 8;
const GRID_FRACTIONS = [0, 0.5, 1];

export const TrendLineChart = ({ points, width, height = 140 }: Props) => {
  const chartW = Math.max(width - PADDING_LEFT - PADDING_RIGHT, 1);
  const chartH = height - PADDING_TOP - PADDING_BOTTOM;

  const maxRaw = Math.max(...points.map((p) => Math.max(p.collected, p.outstanding)), 1);
  const niceMax = Math.ceil(maxRaw / 5000000) * 5000000 || 5000000;

  const xStep = points.length > 1 ? chartW / (points.length - 1) : 0;
  const xFor = (i: number) => PADDING_LEFT + i * xStep;
  const yFor = (v: number) => PADDING_TOP + chartH - (v / niceMax) * chartH;

  const collectedPoints = points.map((p, i) => `${xFor(i)},${yFor(p.collected)}`).join(' ');
  const outstandingPoints = points.map((p, i) => `${xFor(i)},${yFor(p.outstanding)}`).join(' ');

  return (
    <View>
      <Svg width={width} height={height}>
        {GRID_FRACTIONS.map((f) => {
          const y = PADDING_TOP + chartH - f * chartH;
          return (
            <Line
              key={f}
              x1={PADDING_LEFT}
              y1={y}
              x2={width - PADDING_RIGHT}
              y2={y}
              stroke="#EEF2F6"
              strokeWidth={1}
            />
          );
        })}
        {GRID_FRACTIONS.map((f) => {
          const y = PADDING_TOP + chartH - f * chartH;
          return (
            <SvgText
              key={`label-${f}`}
              x={PADDING_LEFT - 6}
              y={y + 3}
              fontSize={9}
              fill="#94A3B8"
              textAnchor="end"
            >
              {formatShort(niceMax * f)}
            </SvgText>
          );
        })}

        <Polyline
          points={outstandingPoints}
          fill="none"
          stroke={COLOR_OUTSTANDING}
          strokeWidth={2}
          strokeDasharray="4,3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Polyline
          points={collectedPoints}
          fill="none"
          stroke={COLOR_COLLECTED}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {points.map((p, i) => (
          <Circle
            key={`o-${p.label}`}
            cx={xFor(i)}
            cy={yFor(p.outstanding)}
            r={2.5}
            fill="#fff"
            stroke={COLOR_OUTSTANDING}
            strokeWidth={1.5}
          />
        ))}
        {points.map((p, i) => (
          <Circle key={`c-${p.label}`} cx={xFor(i)} cy={yFor(p.collected)} r={3} fill={COLOR_COLLECTED} />
        ))}
      </Svg>

      <View style={styles.trendLabelsRow}>
        {points.map((p) => (
          <Text key={p.label} style={styles.trendLabelText}>
            {p.label}
          </Text>
        ))}
      </View>

      <View style={styles.chartLegendRow}>
        <View style={styles.chartLegendItem}>
          <View style={[styles.chartLegendLine, { backgroundColor: COLOR_COLLECTED }]} />
          <Text style={styles.chartLegendText}>Đã thu</Text>
        </View>
        <View style={styles.chartLegendItem}>
          <View style={[styles.chartLegendLine, { backgroundColor: COLOR_OUTSTANDING }]} />
          <Text style={styles.chartLegendText}>Còn phải thu</Text>
        </View>
      </View>
    </View>
  );
};
