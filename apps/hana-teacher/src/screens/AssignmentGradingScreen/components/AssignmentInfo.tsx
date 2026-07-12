import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import type { AssignmentGradingHeader } from '../types';

interface Props {
  header: AssignmentGradingHeader;
}

export const AssignmentInfo = ({ header }: Props) => {
  const { total, graded } = header.progress;
  const done = total > 0 && graded >= total;

  return (
    <View style={styles.infoCard}>
      <View style={styles.cardIconBg}>
        <Icon source="file-document-outline" size={30} color="#007AFF" />
      </View>
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle} numberOfLines={2}>
          {header.name}
        </Text>
        <Text style={styles.cardClass}>{header.className || 'Chưa gán lớp'}</Text>
        <Text style={styles.cardDates}>Điểm tối đa: {header.maxScore}</Text>
      </View>
      <View style={styles.cardRight}>
        <View
          style={[
            styles.statusPendingBadge,
            { backgroundColor: done ? '#E2FBEB' : '#FFF4EB' },
          ]}
        >
          <Text style={[styles.statusPendingText, { color: done ? '#27AE60' : '#E67E22' }]}>
            {done ? 'Hoàn tất' : 'Đang chấm'}
          </Text>
        </View>
        <View style={styles.progressCircle}>
          <Text style={styles.progressText}>
            {graded}/{total}
          </Text>
        </View>
      </View>
    </View>
  );
};
