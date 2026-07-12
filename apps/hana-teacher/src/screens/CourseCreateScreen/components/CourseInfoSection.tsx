import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { CourseFormValues } from '../types';

interface Props {
  form: UseFormReturn<CourseFormValues>;
}

const CourseInfoSection = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="book-open-variant" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin khóa học</Text>
      </View>

      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>
            Tên khóa học <Text style={styles.requiredMark}>*</Text>
          </Text>
          <Controller
            control={control}
            name="name"
            rules={{
              required: 'Vui lòng nhập tên khóa học',
              maxLength: { value: 255, message: 'Tên không được vượt quá 255 ký tự' },
            }}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="VD: Tiếng Anh giao tiếp"
                style={styles.input}
                maxLength={255}
              />
            )}
          />
          {!!errors.name && <Text style={styles.errorText}>{errors.name.message}</Text>}
        </View>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>Mã khóa học</Text>
          <Controller
            control={control}
            name="code"
            render={({ field: { onChange, value } }) => (
              <TextInput value={value} onChangeText={onChange} placeholder="VD: TA01" style={styles.input} />
            )}
          />
        </View>
      </View>

      <View style={styles.fieldRow}>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>
            Thời lượng (phút/buổi) <Text style={styles.requiredMark}>*</Text>
          </Text>
          <Controller
            control={control}
            name="duration_minutes"
            rules={{
              required: 'Vui lòng nhập thời lượng',
              validate: (v) => (Number(v) > 0 ? true : 'Thời lượng phải lớn hơn 0'),
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="VD: 60"
                keyboardType="numeric"
                style={styles.input}
              />
            )}
          />
          {!!errors.duration_minutes && (
            <Text style={styles.errorText}>{errors.duration_minutes.message}</Text>
          )}
        </View>
        <View style={[styles.fieldGroup, styles.fieldRowItem]}>
          <Text style={styles.fieldLabel}>
            Học phí / buổi (đ) <Text style={styles.requiredMark}>*</Text>
          </Text>
          <Controller
            control={control}
            name="price_per_lesson"
            rules={{
              required: 'Vui lòng nhập học phí',
              validate: (v) => (Number(v) >= 0 ? true : 'Học phí không hợp lệ'),
            }}
            render={({ field: { onChange, value } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="VD: 150000"
                keyboardType="numeric"
                style={styles.input}
              />
            )}
          />
          {!!errors.price_per_lesson && (
            <Text style={styles.errorText}>{errors.price_per_lesson.message}</Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default CourseInfoSection;
