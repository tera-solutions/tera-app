import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';

import { styles } from '../styles';
import { CRITERION_KEYS, CRITERION_LABEL } from '../constants';
import type { EvaluationCreateForm } from '../types';

interface Props {
  form: UseFormReturn<EvaluationCreateForm>;
}

const SCORES = [1, 2, 3, 4, 5];

const CriteriaSection = ({ form }: Props) => (
  <View style={styles.card}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
      <Icon source="clipboard-check-outline" size={18} color="#007AFF" />
      <Text style={styles.sectionTitle}>Tiêu chí đánh giá</Text>
    </View>
    <Text style={styles.hintText}>Chấm mỗi tiêu chí từ 1 (yếu) đến 5 (xuất sắc)</Text>

    {CRITERION_KEYS.map((key) => (
      <Controller
        key={key}
        control={form.control}
        name={`criteria.${key}`}
        rules={{ required: true, min: 1, max: 5 }}
        render={({ field: { onChange, value } }) => (
          <View style={styles.criterionRow}>
            <Text style={styles.criterionLabel}>{CRITERION_LABEL[key]}</Text>
            <View style={styles.ratingDots}>
              {SCORES.map((score) => {
                const active = value === score;
                return (
                  <TouchableRipple
                    key={score}
                    onPress={() => onChange(score)}
                    style={[styles.ratingDot, active && styles.ratingDotActive]}
                  >
                    <Text style={[styles.ratingDotText, active && styles.ratingDotTextActive]}>{score}</Text>
                  </TouchableRipple>
                );
              })}
            </View>
          </View>
        )}
      />
    ))}
  </View>
);

export default CriteriaSection;
