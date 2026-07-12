import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { DateTime } from '@components/ui/DateTime';

import { styles } from '../styles';
import type { AssignmentCreateForm } from '../types';

interface DueDateSectionProps {
  form: UseFormReturn<AssignmentCreateForm>;
}

const todayStr = () => new Date().toISOString().slice(0, 10);

const DueDateSection = ({ form }: DueDateSectionProps) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="calendar-clock" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Hạn nộp</Text>
      </View>

      <Controller
        control={control}
        name="due_date"
        rules={{
          required: 'Vui lòng chọn hạn nộp',
          validate: (value) => value >= todayStr() || 'Hạn nộp phải sau thời điểm hiện tại',
        }}
        render={({ field: { onChange, value } }) => (
          <DateTime value={value} onChange={(v) => onChange(v ?? '')} />
        )}
      />
      {!!errors.due_date && <Text style={styles.errorText}>{errors.due_date.message}</Text>}
      <Text style={styles.hintText}>Bài tập sẽ đóng lúc 23:59 ngày đã chọn.</Text>
    </View>
  );
};

export default DueDateSection;
