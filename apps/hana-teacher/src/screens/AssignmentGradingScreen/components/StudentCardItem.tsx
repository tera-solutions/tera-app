import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { SUBMISSION_STATUS_META } from '../constants';
import type { SubmissionRow } from '../types';

interface StudentCardItemProps {
  item: SubmissionRow;
  index: number;
  isActive: boolean;
  onSelect: () => void;
}

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

export const StudentCardItem = ({ item, index, isActive, onSelect }: StudentCardItemProps) => {
  const statusMeta = SUBMISSION_STATUS_META[item.status] ?? SUBMISSION_STATUS_META.assigned;

  return (
    <TouchableOpacity
      style={[styles.studentCard, isActive && styles.activeStudentCard]}
      onPress={onSelect}
    >
      <Text style={styles.studentIndex}>{String(index + 1).padStart(2, '0')}</Text>
      {item.studentAvatar ? (
        <Image source={{ uri: item.studentAvatar }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarInitial}>
          <Text style={styles.avatarInitialText}>{initialOf(item.studentName)}</Text>
        </View>
      )}
      <View style={styles.studentMeta}>
        <Text style={styles.studentName} numberOfLines={1}>
          {item.studentName}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
          <Text style={[styles.statusBadgeText, { color: statusMeta.text }]}>{statusMeta.label}</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.scoreText}>{item.score ?? '--'}</Text>
        <Icon source="chevron-right" size={16} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
};
