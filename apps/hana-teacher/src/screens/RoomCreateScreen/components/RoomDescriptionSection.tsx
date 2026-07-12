import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { RoomFormValues } from '../types';

interface Props {
  form: UseFormReturn<RoomFormValues>;
}

const RoomDescriptionSection = ({ form }: Props) => {
  const { control } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="text-box-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Mô tả / Thiết bị</Text>
      </View>

      <View>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="VD: 1 máy chiếu, 1 màn hình, 1 loa"
              style={styles.inputMultiline}
              multiline
              numberOfLines={4}
            />
          )}
        />
        <Text style={styles.hintText}>Không bắt buộc — có thể bổ sung sau.</Text>
      </View>
    </View>
  );
};

export default RoomDescriptionSection;
