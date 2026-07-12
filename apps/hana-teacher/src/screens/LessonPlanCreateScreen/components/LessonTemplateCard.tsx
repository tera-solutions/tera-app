import React, { useState } from 'react';
import { View } from 'react-native';
import { Icon, IconButton, Text, TouchableRipple } from 'react-native-paper';
import { TextInput } from '@components/ui';

import { styles } from '../styles';
import type { LessonTemplateForm } from '../types';
import ActivityEditor from './ActivityEditor';

interface LessonTemplateCardProps {
  index: number;
  template: LessonTemplateForm;
  onChange: (next: LessonTemplateForm) => void;
  onRemove: () => void;
}

const LessonTemplateCard = ({ index, template, onChange, onRemove }: LessonTemplateCardProps) => {
  const [expanded, setExpanded] = useState(!template.lesson_title);

  const patch = (fields: Partial<LessonTemplateForm>) => onChange({ ...template, ...fields });

  return (
    <View style={styles.templateCard}>
      <TouchableRipple onPress={() => setExpanded((prev) => !prev)}>
        <View style={styles.templateHeader}>
          <View style={styles.templateIndex}>
            <Text style={styles.templateIndexText}>{index}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.templateTitle} numberOfLines={1}>
              {template.lesson_title || 'Buổi học mới'}
            </Text>
            {!!template.duration && (
              <Text style={styles.templateSubtitle}>{template.duration} phút</Text>
            )}
          </View>
          <IconButton icon="trash-can-outline" size={18} iconColor="#94A3B8" onPress={onRemove} />
          <Icon source={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#94A3B8" />
        </View>
      </TouchableRipple>

      {expanded && (
        <View style={styles.templateBody}>
          <View style={styles.fieldRow}>
            <View style={[styles.fieldRowItem, { flex: 2 }]}>
              <Text style={styles.fieldLabel}>Tiêu đề buổi học</Text>
              <TextInput
                value={template.lesson_title}
                onChangeText={(text) => patch({ lesson_title: text })}
                placeholder="Ví dụ: My Family"
                style={styles.input}
                maxLength={255}
              />
            </View>
            <View style={styles.fieldRowItem}>
              <Text style={styles.fieldLabel}>Thời lượng (phút)</Text>
              <TextInput
                keyboardType="number-pad"
                value={template.duration ? String(template.duration) : ''}
                onChangeText={(text) => patch({ duration: text ? Number(text) : undefined })}
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Mục tiêu bài học (mỗi dòng một mục tiêu)</Text>
            <TextInput
              value={template.objective}
              onChangeText={(text) => patch({ objective: text })}
              placeholder={'Giới thiệu bản thân\nSử dụng từ vựng cơ bản'}
              multiline
              numberOfLines={3}
              style={[styles.input, { height: 70 }]}
              maxLength={5000}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Từ vựng</Text>
            <TextInput
              value={template.vocabulary}
              onChangeText={(text) => patch({ vocabulary: text })}
              style={styles.input}
              maxLength={5000}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Ngữ pháp</Text>
            <TextInput
              value={template.grammar}
              onChangeText={(text) => patch({ grammar: text })}
              style={styles.input}
              maxLength={5000}
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Bài tập về nhà</Text>
            <TextInput
              value={template.homework}
              onChangeText={(text) => patch({ homework: text })}
              style={styles.input}
              maxLength={5000}
            />
          </View>

          <ActivityEditor
            activities={template.activities}
            onChange={(activities) => patch({ activities })}
          />
        </View>
      )}
    </View>
  );
};

export default LessonTemplateCard;
