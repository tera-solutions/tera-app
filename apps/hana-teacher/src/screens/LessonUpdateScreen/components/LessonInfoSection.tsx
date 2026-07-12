import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';
import AsyncPickerField, { AsyncPickerOption } from '@components/common/AsyncPickerField';

import { RoomService } from '@tera/modules/education';

import { styles } from '../styles';
import type { LessonUpdateFormValues } from '../types';

interface Props {
  form: UseFormReturn<LessonUpdateFormValues>;
}

const roomToOption = (room: any): AsyncPickerOption => ({ value: room.id, label: room.room_name ?? room.name });

const LessonInfoSection = ({ form }: Props) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="book-open-variant" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin bài học</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Tiêu đề bài học <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="lesson_title"
          rules={{
            required: 'Vui lòng nhập tiêu đề bài học',
            maxLength: { value: 255, message: 'Tiêu đề không được vượt quá 255 ký tự' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="VD: Hello! – Getting to know you"
              style={styles.input}
              maxLength={255}
            />
          )}
        />
        {!!errors.lesson_title && <Text style={styles.errorText}>{errors.lesson_title.message}</Text>}
      </View>

      <View>
        <Text style={styles.fieldLabel}>Phòng học</Text>
        <Controller
          control={control}
          name="room_id"
          render={({ field: { onChange, value } }) => (
            <AsyncPickerField
              title="Chọn phòng học"
              placeholder="Chọn phòng học"
              value={value}
              valueLabel={watch('room_name')}
              useList={RoomService.useRoomList}
              toOption={roomToOption}
              onSelect={(option) => {
                onChange(Number(option.value));
                setValue('room_name', option.label);
              }}
            />
          )}
        />
      </View>
    </View>
  );
};

export default LessonInfoSection;
