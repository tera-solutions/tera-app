import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { Switch } from '@components/ui/Switch';

import { styles } from '../styles';
import type { AssignmentCreateForm } from '../types';

interface SubmissionOptionsSectionProps {
  form: UseFormReturn<AssignmentCreateForm>;
}

const SubmissionOptionsSection = ({ form }: SubmissionOptionsSectionProps) => {
  const { control } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <Icon source="tune" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Tùy chọn nộp bài</Text>
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Cho phép nộp bài trễ hạn</Text>
        <Controller
          control={control}
          name="allow_late_submission"
          render={({ field: { onChange, value } }) => (
            <Switch value={!!value} onValueChange={onChange} />
          )}
        />
      </View>

      <View style={styles.switchRow}>
        <Text style={styles.switchLabel}>Cho phép nộp lại nhiều lần</Text>
        <Controller
          control={control}
          name="allow_multiple_submission"
          render={({ field: { onChange, value } }) => (
            <Switch value={!!value} onValueChange={onChange} />
          )}
        />
      </View>
    </View>
  );
};

export default SubmissionOptionsSection;
