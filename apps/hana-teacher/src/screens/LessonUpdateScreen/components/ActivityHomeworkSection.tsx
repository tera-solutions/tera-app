import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { Icon, Text } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { LessonUpdateFormValues } from '../types';

interface Props {
  form: UseFormReturn<LessonUpdateFormValues>;
}

const ActivityHomeworkSection = ({ form }: Props) => {
  const { control } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="vector-polyline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Hoạt động & Bài tập</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Hoạt động trong bài</Text>
        <Controller
          control={control}
          name="activities"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={'Mỗi dòng một hoạt động, VD:\nWarm-up (5 phút): Giới thiệu chủ đề bằng hình ảnh'}
              style={styles.inputMultiline}
              multiline
              numberOfLines={4}
            />
          )}
        />
        <Text style={styles.hintText}>Mỗi dòng sẽ hiển thị là một hoạt động riêng biệt.</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Bài tập về nhà</Text>
        <Controller
          control={control}
          name="homework"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Nội dung bài tập giao thêm cho học viên..."
              style={styles.inputMultiline}
              multiline
              numberOfLines={3}
            />
          )}
        />
      </View>

      <View>
        <Text style={styles.fieldLabel}>Ghi chú</Text>
        <Controller
          control={control}
          name="lesson_note"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Ghi chú cá nhân cho bài học này..."
              style={styles.inputMultiline}
              multiline
              numberOfLines={3}
            />
          )}
        />
      </View>
    </View>
  );
};

export default ActivityHomeworkSection;
