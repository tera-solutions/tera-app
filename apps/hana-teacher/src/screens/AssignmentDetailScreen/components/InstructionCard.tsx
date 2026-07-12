import React from 'react';
import { View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { styles } from '../styles';

interface Props {
  instruction: string;
}

export const InstructionCard = ({ instruction }: Props) => (
  <View style={styles.card}>
    <View style={styles.sectionTitleRow}>
      <Icon source="text-box-outline" size={18} color="#007AFF" />
      <Text style={styles.sectionTitle}>Mô tả / Yêu cầu</Text>
    </View>
    <Text style={styles.instructionText}>{instruction || 'Chưa có mô tả'}</Text>
  </View>
);
