import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { styles } from '../styles';

interface Props {
  objectives: string[];
}

export const ObjectiveList = ({ objectives }: Props) => {
  if (objectives.length === 0) {
    return <Text style={styles.emptyText}>Chưa có mục tiêu cho bài học này.</Text>;
  }

  return (
    <View style={styles.objectiveCard}>
      {objectives.map((item, index) => (
        <View key={index} style={styles.objectiveItem}>
          <Icon source="check-circle" size={18} color="#27AE60" />
          <Text style={styles.objectiveText}>{item}</Text>
        </View>
      ))}
    </View>
  );
};
