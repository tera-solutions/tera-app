import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ObjectiveList } from '../ObjectiveList';
import { MaterialListReal } from '../MaterialListReal';
import { ActivityTimelineList } from '../ActivityTimelineList';
import type { LessonDetail } from '../../types';
import { styles } from '../../styles';

interface Props {
  detail: LessonDetail;
}

export const OverviewTab = ({ detail }: Props) => (
  <>
    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon source="target-account" size={20} color="#007AFF" />
          <Text style={styles.sectionTitle}>Mục tiêu bài học</Text>
        </View>
      </View>
      <ObjectiveList objectives={detail.objectives} />
    </View>

    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon source="folder-open-outline" size={20} color="#007AFF" />
          <Text style={styles.sectionTitle}>Tài liệu sử dụng</Text>
        </View>
      </View>
      <MaterialListReal materials={detail.materials} />
    </View>

    <View style={styles.sectionContainer}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionTitleRow}>
          <Icon source="vector-polyline" size={20} color="#007AFF" />
          <Text style={styles.sectionTitle}>Hoạt động trong bài</Text>
        </View>
      </View>
      <ActivityTimelineList activities={detail.activities} />
    </View>
  </>
);
