import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { COLOR_COLLECTED, COLOR_OUTSTANDING } from '../constants';
import { styles } from '../style';

const SIZE = 96;
const STROKE = 12;
const R = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * R;

interface Props {
  collected: number;
  outstanding: number;
}

export const RateDonutChart = ({ collected, outstanding }: Props) => {
  const total = collected + outstanding || 1;
  const pct = collected / total;

  return (
    <View style={styles.donutWrapper}>
      <Svg width={SIZE} height={SIZE}>
        <Circle cx={SIZE / 2} cy={SIZE / 2} r={R} stroke={COLOR_OUTSTANDING} strokeWidth={STROKE} fill="none" />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={R}
          stroke={COLOR_COLLECTED}
          strokeWidth={STROKE}
          fill="none"
          strokeDasharray={`${pct * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
          rotation="-90"
          origin={`${SIZE / 2},${SIZE / 2}`}
        />
      </Svg>
      <View style={styles.donutCenterLabel}>
        <Text style={styles.donutCenterPct}>{(pct * 100).toFixed(1)}%</Text>
        <Text style={styles.donutCenterCaption}>Tỷ lệ thu</Text>
      </View>
    </View>
  );
};
