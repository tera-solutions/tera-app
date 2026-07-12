import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { CourseService, LevelService } from '@tera/modules/education';
import { REGEX } from '@tera/commons/constants/common';

import { styles } from '../styles';
import type { PickerOption, PlanInfoForm } from '../types';
import PickerField from './PickerField';

interface PlanInfoSectionProps {
  form: UseFormReturn<PlanInfoForm>;
}

const courseToOption = (course: any): PickerOption => ({
  value: course.id,
  label: course.name,
});

const levelToOption = (level: any): PickerOption => ({
  value: level.id,
  label: level.level_name,
});

const PlanInfoSection = ({ form }: PlanInfoSectionProps) => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon source="clipboard-text-outline" size={18} color="#007AFF" />
          <Text style={styles.sectionTitle}>Thông tin giáo án</Text>
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Tên giáo án <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="plan_name"
          rules={{
            required: 'Vui lòng nhập tên giáo án',
            minLength: { value: 2, message: 'Tên giáo án phải có ít nhất 2 ký tự' },
            maxLength: { value: 255, message: 'Tên giáo án không được vượt quá 255 ký tự' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ví dụ: Giáo án Starters 2A"
              style={styles.input}
              maxLength={255}
            />
          )}
        />
        {!!errors.plan_name && (
          <Text style={styles.errorText}>{errors.plan_name.message}</Text>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Mã giáo án <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="plan_code"
          rules={{
            required: 'Vui lòng nhập mã giáo án',
            pattern: {
              value: REGEX.CODE,
              message: 'Mã giáo án chỉ được chứa chữ, số và dấu gạch dưới',
            },
            minLength: { value: 2, message: 'Mã giáo án phải có ít nhất 2 ký tự' },
            maxLength: { value: 50, message: 'Mã giáo án không được vượt quá 50 ký tự' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Ví dụ: LP001"
              autoCapitalize="characters"
              style={styles.input}
              maxLength={50}
            />
          )}
        />
        {!!errors.plan_code && (
          <Text style={styles.errorText}>{errors.plan_code.message}</Text>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>
          Khóa học <Text style={styles.requiredMark}>*</Text>
        </Text>
        <Controller
          control={control}
          name="course_id"
          rules={{ required: 'Vui lòng chọn khóa học' }}
          render={({ field: { onChange, value } }) => (
            <PickerField
              title="Chọn khóa học"
              placeholder="Chọn khóa học"
              value={value}
              valueLabel={watch('course_name')}
              useList={CourseService.useCourseList}
              toOption={courseToOption}
              onSelect={(option) => {
                onChange(Number(option.value));
                setValue('course_name', option.label);
              }}
            />
          )}
        />
        {!!errors.course_id && (
          <Text style={styles.errorText}>{errors.course_id.message}</Text>
        )}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Cấp độ</Text>
        <Controller
          control={control}
          name="level_id"
          render={({ field: { onChange, value } }) => (
            <PickerField
              title="Chọn cấp độ"
              placeholder="Chọn cấp độ"
              value={value}
              valueLabel={watch('level_name')}
              useList={LevelService.useLevelList}
              toOption={levelToOption}
              onSelect={(option) => {
                onChange(Number(option.value));
                setValue('level_name', option.label);
              }}
            />
          )}
        />
      </View>

      <View>
        <Text style={styles.fieldLabel}>Mô tả</Text>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              placeholder="Mô tả giáo án"
              multiline
              numberOfLines={4}
              style={[styles.input, { height: 90 }]}
              maxLength={2000}
            />
          )}
        />
      </View>
    </View>
  );
};

export default PlanInfoSection;
