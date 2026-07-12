import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import { ASSIGNMENT_TYPE_OPTIONS } from '../constants';
import type { AssignmentCreateForm } from '../types';

interface AssignmentInfoSectionProps {
  form: UseFormReturn<AssignmentCreateForm>;
}

const AssignmentInfoSection = ({ form }: AssignmentInfoSectionProps) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="clipboard-text-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin bài tập</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Tên bài tập <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="assignment_name"
          rules={{
            required: 'Vui lòng nhập tên bài tập',
            maxLength: { value: 255, message: 'Tên bài tập không được vượt quá 255 ký tự' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="VD: Write the missing letters"
              style={styles.input}
              maxLength={255}
            />
          )}
        />
        {!!errors.assignment_name && (
          <Text style={styles.errorText}>{errors.assignment_name.message}</Text>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Loại bài tập</Text>
        <Controller
          control={control}
          name="assignment_type"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipRow}>
              {ASSIGNMENT_TYPE_OPTIONS.map((option) => {
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

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Điểm tối đa <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="max_score"
          rules={{
            required: 'Vui lòng nhập điểm tối đa',
            min: { value: 1, message: 'Điểm tối đa phải lớn hơn 0' },
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
        {!!errors.max_score && <Text style={styles.errorText}>{errors.max_score.message}</Text>}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Mô tả</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Mô tả ngắn gọn về bài tập..."
              multiline
              numberOfLines={2}
              style={[styles.input, { height: 60 }]}
              maxLength={5000}
            />
          )}
        />
      </View>

      <View>
        <Text style={styles.fieldLabel}>
          Yêu cầu <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="instruction"
          rules={{
            required: 'Vui lòng nhập yêu cầu bài tập',
            maxLength: { value: 10000, message: 'Yêu cầu không được vượt quá 10000 ký tự' },
          }}
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Hướng dẫn cho học viên..."
              multiline
              numberOfLines={5}
              style={[styles.input, { height: 110 }]}
              maxLength={10000}
            />
          )}
        />
        {!!errors.instruction && <Text style={styles.errorText}>{errors.instruction.message}</Text>}
      </View>
    </View>
  );
};

export default AssignmentInfoSection;
