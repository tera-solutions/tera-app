import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';
import { DateTime } from '@components/ui/DateTime';

import { styles } from '../styles';
import { GENDER_OPTIONS } from '../constants';
import type { ProfileFormValues } from '../types';

interface Props {
  form: UseFormReturn<ProfileFormValues>;
}

const ProfileInfoSection = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="account-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Họ tên <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="full_name"
          rules={{
            required: 'Vui lòng nhập họ tên',
            maxLength: { value: 255, message: 'Họ tên không được vượt quá 255 ký tự' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="VD: Nguyễn Thị Hạ"
              style={styles.input}
              maxLength={255}
            />
          )}
        />
        {!!errors.full_name && <Text style={styles.errorText}>{errors.full_name.message}</Text>}
      </View>

      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>Ngày sinh</Text>
          <Controller
            control={control}
            name="dob"
            render={({ field: { onChange, value } }) => (
              <DateTime value={value} onChange={(v) => onChange(v ?? '')} />
            )}
          />
        </View>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>Số điện thoại</Text>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="09xxxxxxxx"
                keyboardType="phone-pad"
                style={styles.input}
              />
            )}
          />
        </View>
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

export default ProfileInfoSection;
