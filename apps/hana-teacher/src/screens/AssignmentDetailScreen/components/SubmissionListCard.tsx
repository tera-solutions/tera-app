import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import { SUBMISSION_STATUS_META } from '../constants';
import type { SubmissionRow } from '../types';

interface Props {
  rows: SubmissionRow[];
  isLoading: boolean;
  maxScore: number;
  onSelectStudent: (row: SubmissionRow) => void;
}

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

export const SubmissionListCard = ({ rows, isLoading, maxScore, onSelectStudent }: Props) => (
  <View style={styles.card}>
    <View style={styles.sectionTitleRow}>
      <Icon source="account-group-outline" size={18} color="#007AFF" />
      <Text style={styles.sectionTitle}>Danh sách học viên</Text>
    </View>

    {isLoading ? (
      <ActivityIndicator />
    ) : rows.length === 0 ? (
      <Text style={styles.emptyText}>Chưa có học viên nộp bài</Text>
    ) : (
      rows.map((row) => {
        const statusMeta = SUBMISSION_STATUS_META[row.status] ?? SUBMISSION_STATUS_META.assigned;
        return (
          <TouchableOpacity
            key={row.id}
            style={styles.studentRow}
            onPress={() => onSelectStudent(row)}
          >
            <View style={styles.studentAvatar}>
              <Text style={styles.studentAvatarText}>{initialOf(row.studentName)}</Text>
            </View>
            <Text style={styles.studentName} numberOfLines={1}>
              {row.studentName}
            </Text>
            {row.score != null && (
              <Text style={styles.studentScore}>
                {row.score}/{maxScore}
              </Text>
            )}
            <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
              <Text style={[styles.statusBadgeText, { color: statusMeta.text }]}>{statusMeta.label}</Text>
            </View>
          </TouchableOpacity>
        );
      })
    )}
  </View>
);
