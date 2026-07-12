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

const ParentSection = ({ form }: Props) => {
  const { control } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="account-heart-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Phụ huynh</Text>
      </View>
      <Text style={styles.hintText}>Không bắt buộc — có thể bổ sung sau.</Text>

      <View style={[styles.fieldRow, { marginTop: 12 }]}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>Tên phụ huynh</Text>
          <Controller
            control={control}
            name="parent_name"
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="VD: Nguyễn Văn B"
                style={styles.input}
              />
            )}
          />
        </View>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>SĐT phụ huynh</Text>
          <Controller
            control={control}
            name="parent_phone"
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

export default ParentSection;
