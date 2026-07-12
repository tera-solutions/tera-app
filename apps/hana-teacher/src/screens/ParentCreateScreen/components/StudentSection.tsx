import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import AsyncPickerField, { AsyncPickerOption } from '@components/common/AsyncPickerField';

import { StudentService } from '@tera/modules/education';

import { styles } from '../styles';
import type { ParentCreateForm } from '../types';

interface Props {
  form: UseFormReturn<ParentCreateForm>;
}

const studentToOption = (student: any): AsyncPickerOption => ({
  value: student.id,
  label: `${student.name}${student.code ? ` (${student.code})` : ''}`,
});

const StudentSection = ({ form }: Props) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="school-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Con học viên</Text>
      </View>

      <Text style={styles.fieldLabel}>
        Chọn học viên <Text style={styles.requiredMark}>*</Text>
      </Text>
      <Controller
        control={control}
        name="student_id"
        rules={{ required: 'Vui lòng chọn học viên' }}
        render={({ field: { onChange, value } }) => (
          <AsyncPickerField
            title="Chọn học viên"
            placeholder="Chọn học viên"
            value={value}
            valueLabel={form.watch('student_label')}
            useList={StudentService.useStudentList}
            toOption={studentToOption}
            onSelect={(option) => {
              onChange(Number(option.value));
              setValue('student_label', option.label);
            }}
          />
        )}
      />
      {!!errors.student_id && <Text style={styles.errorText}>{errors.student_id.message}</Text>}
    </View>
  );
};

export default StudentSection;
