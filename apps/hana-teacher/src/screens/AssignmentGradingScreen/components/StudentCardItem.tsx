import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export interface StudentGradingData {
  id: string;
  index: string;
  name: string;
  avatar: string;
  score: string | null;
  status: 'submitted' | 'pending';
  statusLabel: string;
}

interface StudentCardItemProps {
  item: StudentGradingData;
  isActive: boolean;
  onSelect: () => void;
}

export const StudentCardItem = ({
  item,
  isActive,
  onSelect,
}: StudentCardItemProps) => {
  const isSubmitted = item.status === 'submitted';

  return (
    <TouchableOpacity
      style={[styles.studentCard, isActive && styles.activeStudentCard]}
      onPress={onSelect}
    >
      <Text style={styles.studentIndex}>{item.index}</Text>
      <Image source={{ uri: item.avatar }} style={styles.avatar} />
      <View style={styles.studentMeta}>
        <Text style={styles.studentName} numberOfLines={1}>
          {item.name}
        </Text>
        <View
          style={
            isSubmitted ? styles.statusSubmitBadge : styles.statusPendingBadge
          }
        >
          <Text
            style={
              isSubmitted ? styles.statusSubmitText : styles.statusPendingText
            }
          >
            {item.statusLabel}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.scoreText}>{item.score || '--'}</Text>
        <Icon source="chevron-right" size={16} color="#CBD5E1" />
      </View>
    </TouchableOpacity>
  );
};
