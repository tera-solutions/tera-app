import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import { STATUS_META, TYPE_LABEL } from '../constants';
import { formatDueDate } from '../_utils';
import type { AssignmentDetailData } from '../types';

interface Props {
  assignment: AssignmentDetailData;
  onGrade: () => void;
}

export const AssignmentSummaryCard = ({ assignment, onGrade }: Props) => {
  const statusMeta = STATUS_META[assignment.status] ?? STATUS_META.draft;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTitleRow}>
        <Text style={styles.summaryTitle}>{assignment.name}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusMeta.text }]}>{statusMeta.label}</Text>
        </View>
      </View>

      <View style={styles.summaryMetaRow}>
        {!!assignment.code && <Text style={styles.summaryMetaText}>{assignment.code}</Text>}
        <Text style={styles.summaryMetaText}>• {TYPE_LABEL[assignment.type] ?? assignment.type}</Text>
        <Text style={styles.summaryMetaText}>• Lớp: {assignment.className || '—'}</Text>
        <Text style={styles.summaryMetaText}>• Điểm tối đa: {assignment.maxScore}</Text>
      </View>
      <Text style={styles.summaryMetaDue}>Hạn nộp: {formatDueDate(assignment.dueDate)}</Text>

      <View style={styles.actionsRow}>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnOutline]} disabled>
          <Icon source="pencil-outline" size={16} color="#94A3B8" />
          <Text style={[styles.actionBtnTextOutline, { color: '#94A3B8' }]}>Sửa</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.actionBtnPrimary]} onPress={onGrade}>
          <Icon source="check-decagram-outline" size={16} color="#FFF" />
          <Text style={styles.actionBtnTextPrimary}>Chấm bài</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
