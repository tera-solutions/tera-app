import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { styles } from '../styles';

export interface ScheduleData {
  id: string;
  startTime: string;
  endTime: string;
  duration: string;
  className: string;
  classColor: { bg: string; text: string; indicator: string };
  lessonName: string;
  room: string;
  branch: string;
  unit: string;
  status: 'upcoming' | 'ongoing' | 'not_started';
  students: string;
  avatar: any;
}

const getStatusStyle = (status: ScheduleData['status']) => {
  switch (status) {
    case 'ongoing':
      return { text: 'Đang diễn ra', bg: '#ECFDF5', color: '#10B981' };
    case 'upcoming':
      return { text: 'Sắp diễn ra', bg: '#EFF6FF', color: '#3B82F6' };
    default:
      return { text: 'Chưa bắt đầu', bg: '#F1F5F9', color: '#64748B' };
  }
};

export const ScheduleItem: React.FC<{ item: ScheduleData }> = ({ item }) => {
  const statusStyle = getStatusStyle(item.status);

  return (
    <View style={styles.scheduleRow}>
      <View
        style={[
          styles.mainCardColumn,
          { borderColor: item.classColor.indicator },
        ]}
      >
        <View style={styles.timeColumn}>
          <Text style={styles.timeText}>{item.startTime}</Text>
          <Text style={styles.timeDivider}>—</Text>
          <Text style={styles.timeText}>{item.endTime}</Text>
          <Text style={styles.durationText}>{item.duration}</Text>
        </View>

        <View style={styles.timeDividerVertical} />
        <Image
          source={item.avatar}
          style={styles.classAvatar}
          resizeMode="contain"
        />

        <View style={styles.cardInfo}>
          <View
            style={[
              styles.classBadgeWrapper,
              { backgroundColor: item.classColor.bg },
            ]}
          >
            <Text
              style={[styles.classBadgeText, { color: item.classColor.text }]}
            >
              {item.className}
            </Text>
          </View>
          <Text style={styles.lessonName} numberOfLines={2}>
            {item.lessonName}
          </Text>
          <Text style={styles.roomText}>
            {item.room} • {item.branch}
          </Text>
          <Text style={styles.unitText}>{item.unit}</Text>
        </View>

        <View style={styles.rightMetaColumn}>
          <IconButton
            icon={({ size, color }) => (
              <Icon source="dots-horizontal" size={size} color={color} />
            )}
            size={20}
            style={{ margin: 0, padding: 0 }}
            onPress={() => {}}
          />

          <View
            style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}
          >
            <Text style={[styles.statusText, { color: statusStyle.color }]}>
              {statusStyle.text}
            </Text>
          </View>

          <View style={styles.studentCountRow}>
            <Icon source="account" size={14} color="#64748B" />
            <Text style={styles.studentCountText}>{item.students}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
