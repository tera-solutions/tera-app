import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { ParentCreateForm } from '../types';

interface Props {
  form: UseFormReturn<ParentCreateForm>;
}

const ParentInfoSection = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="account-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin phụ huynh</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Họ tên <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="name"
          rules={{ required: 'Vui lòng nhập họ tên' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="VD: Trần Thị An"
              style={styles.input}
            />
          )}
        />
        {!!errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Số điện thoại <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="phone"
          rules={{ required: 'Vui lòng nhập số điện thoại' }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="09xxxxxxxx"
              keyboardType="phone-pad"
              style={styles.input}
            />
          )}
        />
        {!!errors.phone && <Text style={styles.errorText}>{errors.phone.message}</Text>}
      </View>

      <View>
        <Text style={styles.fieldLabel}>Email</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="email@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
              style={styles.input}
            />
          )}
        />
      </View>
    </View>
  );
};

export default ParentInfoSection;
