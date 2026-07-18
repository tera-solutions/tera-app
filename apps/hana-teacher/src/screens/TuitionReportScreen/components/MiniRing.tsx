import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { styles } from '../style';

const SIZE = 40;
const STROKE = 4;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface Props {
  percent: number;
  color?: string;
}

export const MiniRing = ({ percent, color = '#2563EB' }: Props) => {
  const pct = Math.max(0, Math.min(1, percent));

  return (
    <View style={styles.miniRingWrapper}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke="#E2E8F0" strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={color}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${pct * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2},${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.miniRingLabel}>
        <Text style={styles.miniRingText}>{Math.round(pct * 100)}%</Text>
      </View>
    </View>
  );
};
