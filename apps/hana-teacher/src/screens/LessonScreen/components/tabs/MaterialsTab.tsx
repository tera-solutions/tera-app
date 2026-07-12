import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { MaterialListReal } from '../MaterialListReal';
import type { LessonMaterialItem } from '../../types';
import { styles } from '../../styles';

interface Props {
  materials: LessonMaterialItem[];
}

export const MaterialsTab = ({ materials }: Props) => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Icon source="folder-open-outline" size={20} color="#007AFF" />
        <Text style={styles.sectionTitle}>Tài liệu sử dụng</Text>
      </View>
    </View>
    <MaterialListReal materials={materials} />
  </View>
);
