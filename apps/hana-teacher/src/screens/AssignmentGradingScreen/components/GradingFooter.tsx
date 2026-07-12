import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Icon } from 'react-native-paper';
import { styles } from '../styles';

interface Props {
  hasPrev: boolean;
  hasNext: boolean;
  isSubmitting: boolean;
  disabled: boolean;
  onPrev: () => void;
  onSave: () => void;
}

export const GradingFooter = ({ hasPrev, hasNext, isSubmitting, disabled, onPrev, onSave }: Props) => (
  <View style={styles.bottomActions}>
    <TouchableOpacity
      style={[styles.outlineBtn, !hasPrev && { opacity: 0.5 }]}
      onPress={onPrev}
      disabled={!hasPrev}
    >
      <Icon source="chevron-left" size={20} color="#64748B" />
      <Text style={styles.outlineBtnText}>Bài trước</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.primaryBtn, disabled && { opacity: 0.5 }]}
      onPress={onSave}
      disabled={disabled || isSubmitting}
    >
      {isSubmitting ? (
        <ActivityIndicator size={16} color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.primaryBtnText}>
            {hasNext ? 'Lưu và chuyển bài sau' : 'Lưu điểm'}
          </Text>
          {hasNext && <Icon source="chevron-right" size={20} color="#FFFFFF" />}
        </>
      )}
    </TouchableOpacity>
  </View>
);
