import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import AsyncPickerField from '@components/common/AsyncPickerField';

import { CourseService, LevelService } from '@tera/modules/education';

import { styles } from '../styles';
import type { ExamCreateForm, PickerOption } from '../types';

interface Props {
  form: UseFormReturn<ExamCreateForm>;
}

const courseToOption = (course: any): PickerOption => ({ value: course.id, label: course.name });
const levelToOption = (level: any): PickerOption => ({ value: level.id, label: level.level_name });

const ScopeSection = ({ form }: Props) => {
  const { control, watch, setValue } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="target" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Phạm vi áp dụng</Text>
      </View>
      <Text style={styles.hintText}>Không bắt buộc — có thể để trống.</Text>

      <View style={[styles.fieldGroup, { marginTop: 12 }]}>
        <Text style={styles.fieldLabel}>Khóa học</Text>
        <Controller
          control={control}
          name="course_id"
          render={({ field: { onChange, value } }) => (
            <AsyncPickerField
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
      </View>

      <View>
        <Text style={styles.fieldLabel}>Hạng thứ</Text>
        <Controller
          control={control}
          name="level_id"
          render={({ field: { onChange, value } }) => (
            <AsyncPickerField
              title="Chọn hạng thứ"
              placeholder="Chọn hạng thứ"
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
    </View>
  );
};

export default ScopeSection;
