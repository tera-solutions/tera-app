import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { StudentFormValues } from '../types';

interface Props {
  form: UseFormReturn<StudentFormValues>;
}

const ContactSection = ({ form }: Props) => {
  const { control } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="card-account-phone-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
      </View>

      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>Email</Text>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="email@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.input}
              />
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
    </View>
  );
};

export default ContactSection;
