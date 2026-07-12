import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';
import { DateTime } from '@components/ui/DateTime';

import { styles } from '../styles';
import { GENDER_OPTIONS } from '../constants';
import type { StudentFormValues } from '../types';

interface Props {
  form: UseFormReturn<StudentFormValues>;
}

const StudentInfoSection = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="account-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin học viên</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Họ tên học viên <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="name"
          rules={{
            required: 'Vui lòng nhập tên học viên',
            maxLength: { value: 255, message: 'Tên không được vượt quá 255 ký tự' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="VD: Nguyễn Minh An"
              style={styles.input}
              maxLength={255}
            />
          )}
        />
        {!!errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Ngày sinh <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="dob"
          rules={{ required: 'Vui lòng nhập ngày sinh' }}
          render={({ field: { onChange, value } }) => (
            <DateTime value={value} onChange={(v) => onChange(v ?? '')} />
          )}
        />
        {!!errors.dob && <Text style={styles.errorText}>{errors.dob.message}</Text>}
      </View>

      <View>
        <Text style={styles.fieldLabel}>Giới tính</Text>
        <Controller
          control={control}
          name="gender"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipRow}>
              {GENDER_OPTIONS.map((option) => {
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
    </View>
  );
};

export default StudentInfoSection;
