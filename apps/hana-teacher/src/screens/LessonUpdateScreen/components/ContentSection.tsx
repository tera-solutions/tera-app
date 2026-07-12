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

const ContentSection = ({ form }: Props) => {
  const { control } = form;

  return (
    <View style={styles.card}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <Icon source="target-account" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Mục tiêu & Nội dung</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Mục tiêu bài học</Text>
        <Controller
          control={control}
          name="objective"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder={'Mỗi dòng một mục tiêu, VD:\nHọc sinh có thể chào hỏi và giới thiệu bản thân.'}
              style={styles.inputMultiline}
              multiline
              numberOfLines={4}
            />
          )}
        />
        <Text style={styles.hintText}>Mỗi dòng sẽ hiển thị là một mục tiêu riêng biệt.</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.fieldLabel}>Từ vựng</Text>
        <Controller
          control={control}
          name="vocabulary"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Danh sách từ vựng trong bài..."
              style={styles.inputMultiline}
              multiline
              numberOfLines={3}
            />
          )}
        />
      </View>

      <View>
        <Text style={styles.fieldLabel}>Ngữ pháp</Text>
        <Controller
          control={control}
          name="grammar"
          render={({ field: { onChange, value } }) => (
            <TextInput
              value={value}
              onChangeText={onChange}
              placeholder="Cấu trúc ngữ pháp trong bài..."
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

export default ContentSection;
