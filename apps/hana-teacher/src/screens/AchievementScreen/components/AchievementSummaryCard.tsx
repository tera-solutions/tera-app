import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

interface SummaryProps {
  title: string;
  count: string;
  icon: string;
  color: string;
  bgColor: string;
}

export default function AchievementSummaryCard({
  title,
  count,
  icon,
  color,
  bgColor,
}: SummaryProps) {
  return (
    <View style={styles.summaryCard}>
      <View style={[styles.summaryIconWrapper, { backgroundColor: bgColor }]}>
        <Icon source={icon} size={26} color={color} />
      </View>
      <Text style={[styles.summaryValue, { color }]}>{count}</Text>
      <Text style={styles.summaryLabel} numberOfLines={2}>
        {title}
      </Text>
    </View>
  );
}
