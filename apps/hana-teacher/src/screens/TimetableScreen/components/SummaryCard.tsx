import React from 'react';
import { Text, View } from 'react-native';

import { styles } from '../styles';

export interface SummaryCardProps {
  icon: React.ReactNode;
  value: number | string;
  label: string;
  iconBackgroundColor?: string;
  valueColor?: string;
}

export default function SummaryCard({
  icon,
  value,
  label,
  iconBackgroundColor = '#EEF6FF',
  valueColor = '#0F172A',
}: SummaryCardProps) {
  return (
    <View style={styles.summaryCard}>
      <View
        style={[
          styles.summaryIconWrapper,
          {
            backgroundColor: iconBackgroundColor,
          },
        ]}
      >
        {icon}
      </View>

      <Text
        style={[
          styles.summaryValue,
          {
            color: valueColor,
          },
        ]}
      >
        {value}
      </Text>

      <Text style={styles.summaryLabel}>
        {label}
      </Text>
    </View>
  );
}