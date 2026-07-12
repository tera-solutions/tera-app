import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import { ROOM_TYPE_OPTIONS } from '../constants';
import type { RoomFormValues } from '../types';

interface Props {
  form: UseFormReturn<RoomFormValues>;
}

const RoomInfoSection = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="door-open" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin phòng học</Text>
      </View>

      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>
            Tên phòng <Text style={styles.requiredMark}>*</Text>
          </Text>
          <Controller
            control={control}
            name="room_name"
            rules={{
              required: 'Vui lòng nhập tên phòng',
              maxLength: { value: 255, message: 'Tên không được vượt quá 255 ký tự' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="VD: Phòng 201"
                style={styles.input}
                maxLength={255}
              />
            )}
          />
          {!!errors.room_name && <Text style={styles.errorText}>{errors.room_name.message}</Text>}
        </View>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>Mã phòng</Text>
          <Controller
            control={control}
            name="room_code"
            render={({ field: { onChange, value } }) => (
              <TextInput value={value} onChangeText={onChange} placeholder="VD: P201" style={styles.input} />
            )}
          />
        </View>
      </View>

      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>Tầng</Text>
          <Controller
            control={control}
            name="floor"
            render={({ field: { onChange, value } }) => (
              <TextInput value={value} onChangeText={onChange} placeholder="VD: Tầng 2" style={styles.input} />
            )}
          />
        </View>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>
            Sức chứa <Text style={styles.requiredMark}>*</Text>
          </Text>
          <Controller
            control={control}
            name="capacity"
            rules={{
              required: 'Vui lòng nhập sức chứa',
              validate: (v) => (Number(v) > 0 ? true : 'Sức chứa phải lớn hơn 0'),
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="VD: 30"
                keyboardType="numeric"
                style={styles.input}
              />
            )}
          />
          {!!errors.capacity && <Text style={styles.errorText}>{errors.capacity.message}</Text>}
        </View>
      </View>

      <View>
        <Text style={styles.fieldLabel}>Loại phòng</Text>
        <Controller
          control={control}
          name="room_type"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipRow}>
              {ROOM_TYPE_OPTIONS.map((option) => {
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

export default RoomInfoSection;
