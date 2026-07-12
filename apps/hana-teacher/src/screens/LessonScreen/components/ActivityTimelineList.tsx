import React from 'react';
import { Text, View } from 'react-native';

import { ACTIVITY_STATUS_CONFIG } from '../constants';
import type { LessonActivity } from '../types';
import { styles } from '../styles';

interface Props {
  activities: LessonActivity[];
}

export const ActivityTimelineList = ({ activities }: Props) => {
  if (activities.length === 0) {
    return <Text style={styles.emptyText}>Chưa có hoạt động nào trong bài học này.</Text>;
  }

  return (
    <View style={styles.activityList}>
      {activities.map((activity, index) => {
        const cfg = ACTIVITY_STATUS_CONFIG[activity.status] ?? ACTIVITY_STATUS_CONFIG.pending;
        return (
          <View
            key={activity.id}
            style={[styles.activityItem, index < activities.length - 1 && styles.activityBorder]}
          >
            <View style={styles.activityStep}>
              <Text style={styles.activityStepText}>{index + 1}</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>
                {activity.name}
                {activity.duration > 0 && (
                  <Text style={styles.activityDurationText}> ({activity.duration} phút)</Text>
                )}
              </Text>
              {!!activity.description && <Text style={styles.activityDesc}>{activity.description}</Text>}
            </View>
            <View style={[styles.activityStatusBadge, { backgroundColor: cfg.bg }]}>
              <Text style={[styles.activityStatusText, { color: cfg.color }]}>{cfg.label}</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
};
