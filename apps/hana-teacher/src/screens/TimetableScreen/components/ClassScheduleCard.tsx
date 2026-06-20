import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { styles } from '../styles';

export interface ClassScheduleItem {
  id: string;
  className: string;
  lessonName: string;
  room: string;
  startTime: string;
  endTime: string;
  studentCount: number;
  totalStudents: number;
  status: 'completed' | 'upcoming' | 'cancelled';
}

interface ClassScheduleCardProps {
  item: ClassScheduleItem;
  onPress?: (item: ClassScheduleItem) => void;
}

export default function ClassScheduleCard({
  item,
  onPress,
}: ClassScheduleCardProps) {
  const renderStatus = () => {
    switch (item.status) {
      case 'completed':
        return {
          containerStyle: styles.completedBadge,
          textStyle: styles.completedText,
          label: 'Đã học',
        };

      case 'upcoming':
        return {
          containerStyle: styles.upcomingBadge,
          textStyle: styles.upcomingText,
          label: 'Sắp học',
        };

      case 'cancelled':
        return {
          containerStyle: styles.cancelledBadge,
          textStyle: styles.cancelledText,
          label: 'Đã hủy',
        };

      default:
        return {
          containerStyle: styles.upcomingBadge,
          textStyle: styles.upcomingText,
          label: 'Sắp học',
        };
    }
  };

  const status = renderStatus();

  return (
    <View style={styles.scheduleRow}>
      <View style={styles.timelineColumn}>
        <Text style={styles.timelineTime}>{item.startTime}</Text>

        <View style={styles.timelineDot} />

        <View style={styles.timelineLine} />

        <Text style={styles.timelineTime}>{item.endTime}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        style={styles.classCard}
        onPress={() => onPress?.(item)}
      >
        <View style={styles.classIcon}>
          <Ionicons name="school-outline" size={26} color="#0066cc" />
        </View>

        <View style={styles.classContent}>
          <View style={styles.classTopRow}>
            <Text numberOfLines={1} style={styles.className}>
              {item.className}
            </Text>

            <View style={[styles.statusBadge, status.containerStyle]}>
              <Text style={[styles.statusText, status.textStyle]}>
                {status.label}
              </Text>
            </View>
          </View>

          <Text numberOfLines={2} style={styles.lessonName}>
            {item.lessonName}
          </Text>

          <Text numberOfLines={1} style={styles.roomText}>
            📍 {item.room}
          </Text>
        </View>

        <View style={styles.classRight}>
          <Text style={styles.studentCount}>{item.studentCount}</Text>

          <Text style={styles.studentLabel}>/ {item.totalStudents} HV</Text>

          <Ionicons name="chevron-forward" size={18} color="#94A3B8" />
        </View>
      </TouchableOpacity>
    </View>
  );
}
