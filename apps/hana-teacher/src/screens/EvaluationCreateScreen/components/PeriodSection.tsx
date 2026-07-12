import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';

import { styles } from '../styles';
import { EVALUATION_PERIOD_OPTIONS } from '../constants';
import type { EvaluationCreateForm } from '../types';

interface Props {
  form: UseFormReturn<EvaluationCreateForm>;
}

const PeriodSection = ({ form }: Props) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
      <Icon source="calendar-range" size={18} color="#007AFF" />
      <Text style={styles.sectionTitle}>Kỳ đánh giá</Text>
    </View>

    <Controller
      control={form.control}
      name="evaluation_period"
      render={({ field: { onChange, value } }) => (
        <View style={styles.chipRow}>
          {EVALUATION_PERIOD_OPTIONS.map((option) => {
            const active = value === option.value;
            return (
              <TouchableRipple
                key={option.value}
                onPress={() => onChange(option.value)}
                style={[styles.chip, active && styles.chipActive]}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{option.label}</Text>
              </TouchableRipple>
            );
          })}
        </View>
      )}
    />
  </View>
);

export default PeriodSection;
