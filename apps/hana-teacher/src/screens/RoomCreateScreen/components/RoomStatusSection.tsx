import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';

import { styles } from '../styles';
import { ROOM_STATUS_OPTIONS } from '../constants';
import type { RoomFormValues } from '../types';

interface Props {
  form: UseFormReturn<RoomFormValues>;
}

const RoomStatusSection = ({ form }: Props) => {
  const { control } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="check-circle-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Trạng thái</Text>
      </View>

      <Controller
        control={control}
        name="status"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipRow}>
            {ROOM_STATUS_OPTIONS.map((option) => {
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
  );
};

export default RoomStatusSection;
