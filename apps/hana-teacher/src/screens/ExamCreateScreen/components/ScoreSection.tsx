import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { ExamCreateForm } from '../types';

interface Props {
  form: UseFormReturn<ExamCreateForm>;
}

const ScoreSection = ({ form }: Props) => {
  const {
    control,
    watch,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="star-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thang điểm</Text>
      </View>

      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>
            Tổng điểm <Text style={styles.requiredMark}>*</Text>
          </Text>
          <Controller
            control={control}
            name="total_score"
            rules={{
              required: 'Vui lòng nhập tổng điểm',
              min: { value: 1, message: 'Tổng điểm phải lớn hơn 0' },
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                keyboardType="number-pad"
                value={value ? String(value) : ''}
                onChangeText={(text) => onChange(text ? Number(text) : 0)}
                style={styles.input}
              />
            )}
          />
          {!!errors.total_score && <Text style={styles.errorText}>{errors.total_score.message}</Text>}
        </View>

        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>
            Điểm đạt <Text style={styles.requiredMark}>*</Text>
          </Text>
          <Controller
            control={control}
            name="passing_score"
            rules={{
              required: 'Vui lòng nhập điểm đạt',
              validate: (value) =>
                value <= (watch('total_score') || 0) || 'Điểm đạt không được vượt quá tổng điểm',
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                keyboardType="number-pad"
                value={value != null && value !== undefined ? String(value) : ''}
                onChangeText={(text) => onChange(text ? Number(text) : 0)}
                style={styles.input}
              />
            )}
          />
          {!!errors.passing_score && (
            <Text style={styles.errorText}>{errors.passing_score.message}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default ScoreSection;
