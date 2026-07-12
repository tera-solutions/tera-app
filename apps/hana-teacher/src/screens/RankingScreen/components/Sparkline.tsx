import React from 'react';
import { Text } from 'react-native-paper';
import Svg, { Polyline } from 'react-native-svg';

interface Props {
  values: number[];
  width?: number;
  height?: number;
  color?: string;
}

/** Tiny inline trend line — mobile port of the web's SVG sparkline. */
export const Sparkline = ({ values, width = 56, height = 20, color = '#38BDF8' }: Props) => {
  if (values.length < 2) {
    return <Text style={{ fontSize: 11, color: '#CBD5E1' }}>—</Text>;
  }

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const step = width / (values.length - 1);

  const points = values.map((v, i) => `${i * step},${height - ((v - min) / range) * height}`).join(' ');

  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Polyline points={points} fill="none" stroke={color} strokeWidth={1.5} />
    </Svg>
  );
};
