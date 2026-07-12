import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { EvaluationCreateForm } from '../types';

interface Props {
  form: UseFormReturn<EvaluationCreateForm>;
}

const CommentSection = ({ form }: Props) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="message-text-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>
          Nội dung nhận xét <Text style={styles.requiredMark}>*</Text>
        </Text>
      </View>

      <Controller
        control={control}
        name="comment"
        rules={{
          required: 'Vui lòng nhập nội dung nhận xét',
          minLength: { value: 10, message: 'Nội dung nhận xét cần ít nhất 10 ký tự' },
        }}
        render={({ field: { onChange, value } }) => (
          <TextInput
            value={value}
            onChangeText={onChange}
            placeholder="Nhận xét về học viên..."
            multiline
            numberOfLines={5}
            style={[styles.input, { height: 110 }]}
          />
        )}
      />
      {!!errors.comment && <Text style={styles.errorText}>{errors.comment.message}</Text>}
    </View>
  );
};

export default CommentSection;
