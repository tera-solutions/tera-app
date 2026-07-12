import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { PlanSummary } from '../types';
import { styles } from '../styles';

interface Props {
  plan: PlanSummary;
}

export default function PlanSummaryCard({ plan }: Props) {
  const meta = [plan.courseName, plan.levelName].filter(Boolean).join(' • ');

  return (
    <View style={styles.card}>
      <View style={styles.planRow}>
        <View style={styles.planIconBox}>
          <Icon source="notebook-outline" size={22} color="#0066CC" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.planName} numberOfLines={2}>
            {plan.planName}
          </Text>
          {!!plan.planCode && <Text style={styles.planMeta}>Mã: {plan.planCode}</Text>}
          {!!meta && <Text style={styles.planMeta}>{meta}</Text>}
        </View>
      </View>
    </View>
  );
}
