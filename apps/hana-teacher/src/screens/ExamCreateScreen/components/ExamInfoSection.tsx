import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import { EXAM_TYPE_OPTIONS } from '../constants';
import type { ExamCreateForm } from '../types';

interface Props {
  form: UseFormReturn<ExamCreateForm>;
}

const ExamInfoSection = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="clipboard-text-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin bài kiểm tra</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Tên bài kiểm tra <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="exam_name"
          rules={{
            required: 'Vui lòng nhập tên bài kiểm tra',
            maxLength: { value: 255, message: 'Tên bài kiểm tra không được vượt quá 255 ký tự' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="VD: Kids Starter — Final Exam"
              style={styles.input}
              maxLength={255}
            />
          )}
        />
        {!!errors.exam_name && <Text style={styles.errorText}>{errors.exam_name.message}</Text>}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Loại bài kiểm tra</Text>
        <Controller
          control={control}
          name="exam_type"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipRow}>
              {EXAM_TYPE_OPTIONS.map((option) => {
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

      <View>
        <Text style={styles.fieldLabel}>
          Thời lượng (phút) <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="duration"
          rules={{
            required: 'Vui lòng nhập thời lượng',
            min: { value: 1, message: 'Thời lượng phải lớn hơn 0' },
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
        {!!errors.duration && <Text style={styles.errorText}>{errors.duration.message}</Text>}
      </View>
    </View>
  );
};

export default ExamInfoSection;
