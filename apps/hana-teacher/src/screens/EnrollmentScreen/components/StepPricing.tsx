import React from 'react';
import { View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { Button, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import { PAYMENT_METHOD_OPTIONS, PRICING_PRESETS } from '../constants';
import type { EnrollmentPricing } from '../types';
import { calcTuitionAmount, formatVnd } from '../_utils';

interface StepPricingProps {
  values: EnrollmentPricing;
  onBack: () => void;
  onNext: (values: EnrollmentPricing) => void;
}

const numberField = (control: any, name: keyof EnrollmentPricing, label: string, required?: string) => (
  <View style={styles.fieldRowItem}>
    <Text style={styles.fieldLabel}>
      {label} {required && <Text style={styles.requiredMark}>*</Text>}
    </Text>
    <Controller
      control={control}
      name={name}
      rules={required ? { required } : undefined}
      render={({ field: { onChange, value } }) => (
        <TextInput
          keyboardType="number-pad"
          value={value != null ? String(value) : ''}
          onChangeText={(text) => onChange(text ? Number(text) : 0)}
          style={styles.input}
        />
      )}
    />
  </View>
);

const StepPricing = ({ values, onBack, onNext }: StepPricingProps) => {
  const { control, watch, setValue, handleSubmit } = useForm<EnrollmentPricing>({
    defaultValues: values,
  });
  const watched = watch();

  const applyPreset = (preset: (typeof PRICING_PRESETS)[number]) => {
    setValue('total_lessons', preset.total_lessons);
    setValue('price_per_lesson', preset.price_per_lesson);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.sectionTitle}>Chọn nhanh gói học phí</Text>
      <View style={styles.presetGrid}>
        {PRICING_PRESETS.map((preset) => {
          const isActive =
            watched.total_lessons === preset.total_lessons &&
            watched.price_per_lesson === preset.price_per_lesson;
          return (
            <TouchableRipple
              key={preset.key}
              onPress={() => applyPreset(preset)}
              style={[styles.presetCard, isActive && styles.presetCardActive]}
            >
              <View>
                <Text style={styles.presetLabel}>{preset.label}</Text>
                {preset.price_per_lesson > 0 && (
                  <Text style={styles.presetPrice}>{formatVnd(preset.price_per_lesson)}/buổi</Text>
                )}
              </View>
            </TouchableRipple>
          );
        })}
      </View>

      <View style={styles.fieldRow}>
        {numberField(control, 'total_lessons', 'Số buổi học', 'Vui lòng nhập số buổi học')}
        {numberField(control, 'price_per_lesson', 'Đơn giá / buổi', 'Vui lòng nhập đơn giá mỗi buổi')}
      </View>
      <View style={styles.fieldRow}>
        {numberField(control, 'discount_percent', 'Giảm giá (%)')}
        {numberField(control, 'bonus_lessons', 'Buổi tặng thêm')}
      </View>
      <View style={styles.fieldGroup}>{numberField(control, 'paid_amount', 'Đã thanh toán')}</View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Phương thức thanh toán</Text>
        <Controller
          control={control}
          name="payment_method"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipRow}>
              {PAYMENT_METHOD_OPTIONS.map((option) => {
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

      <Text style={styles.tuitionSummary}>
        Học phí: <Text style={styles.tuitionAmount}>{formatVnd(calcTuitionAmount(watched))}</Text> / học viên
      </Text>

      <View style={styles.stepFooterRow}>
        <Button mode="outlined" onPress={onBack} style={styles.stepFooterBtn} textColor="#64748B">
          Quay lại
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit(onNext)}
          style={[styles.stepFooterBtn, styles.btnSubmit]}
        >
          Tiếp theo
        </Button>
      </View>
    </View>
  );
};

export default StepPricing;
