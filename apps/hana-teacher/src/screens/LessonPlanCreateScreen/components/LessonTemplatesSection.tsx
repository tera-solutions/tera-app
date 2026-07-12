import React from 'react';
import { View } from 'react-native';
import { Icon, Text, TouchableRipple } from 'react-native-paper';

import { styles } from '../styles';
import type { LessonTemplateForm } from '../types';
import { emptyTemplate } from '../_utils';
import LessonTemplateCard from './LessonTemplateCard';

interface LessonTemplatesSectionProps {
  templates: LessonTemplateForm[];
  onChange: (templates: LessonTemplateForm[]) => void;
}

const LessonTemplatesSection = ({ templates, onChange }: LessonTemplatesSectionProps) => {
  const updateAt = (index: number, next: LessonTemplateForm) =>
    onChange(templates.map((t, i) => (i === index ? next : t)));

  const removeAt = (index: number) => onChange(templates.filter((_, i) => i !== index));

  const addTemplate = () => onChange([...templates, emptyTemplate()]);

  return (
    <View style={styles.card}>
      <View style={styles.sectionHeaderRow}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Icon source="book-open-page-variant-outline" size={18} color="#007AFF" />
          <Text style={styles.sectionTitle}>Buổi học</Text>
        </View>
      </View>

      {templates.length === 0 && (
        <View style={styles.emptyState}>
          <Icon source="book-open-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyStateText}>
            Chưa có buổi học nào. Thêm buổi học đầu tiên cho giáo án.
          </Text>
        </View>
      )}

      {templates.map((template, index) => (
        <LessonTemplateCard
          key={index}
          index={index + 1}
          template={template}
          onChange={(next) => updateAt(index, next)}
          onRemove={() => removeAt(index)}
        />
      ))}

      <TouchableRipple onPress={addTemplate} style={styles.addTemplateBtn}>
        <>
          <Icon source="plus" size={18} color="#64748B" />
          <Text style={styles.addTemplateBtnText}>Thêm buổi học</Text>
        </>
      </TouchableRipple>
    </View>
  );
};

export default LessonTemplatesSection;
