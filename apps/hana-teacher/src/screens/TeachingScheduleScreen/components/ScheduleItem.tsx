import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon, IconButton } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { styles } from '../styles';
import { DEFAULT_STATUS_META, STATUS_META, getClassColor } from '../constants';
import { durationLabel } from '../_utils';
import type { ScheduleSession } from '../types';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

export const ScheduleItem: React.FC<{ item: ScheduleSession }> = ({ item }) => {
  const router = useRouter();
  const statusMeta = STATUS_META[item.status] ?? { ...DEFAULT_STATUS_META, label: item.status || DEFAULT_STATUS_META.label };
  const color = getClassColor(item.classId);
  const subtitle = item.sessionName || (item.sessionNo ? `Buổi ${item.sessionNo}` : '');

  return (
    <View style={styles.scheduleRow}>
      <TouchableOpacity
        style={[styles.mainCardColumn, { borderColor: color.indicator }]}
        activeOpacity={0.85}
        onPress={() => router.push(`/student/attendance?classId=${item.classId}`)}
      >
        <View style={styles.timeColumn}>
          <Text style={styles.timeText}>{item.startTime}</Text>
          <Text style={styles.timeDivider}>—</Text>
          <Text style={styles.timeText}>{item.endTime}</Text>
          <Text style={styles.durationText}>{durationLabel(item.startTime, item.endTime)}</Text>
        </View>

        <View style={styles.timeDividerVertical} />
        <View style={[styles.classAvatar, { backgroundColor: color.bg, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 16, fontWeight: '700', color: color.text }}>{initialOf(item.className)}</Text>
        </View>

        <View style={styles.cardInfo}>
          <View style={[styles.classBadgeWrapper, { backgroundColor: color.bg }]}>
            <Text style={[styles.classBadgeText, { color: color.text }]}>{item.className || 'Chưa gán lớp'}</Text>
          </View>
          <Text style={styles.lessonName} numberOfLines={2}>
            {subtitle || item.level || 'Buổi học'}
          </Text>
          <Text style={styles.roomText}>
            {item.room || 'Chưa xếp phòng'} • {item.branch || '—'}
          </Text>
          {!!item.level && <Text style={styles.unitText}>{item.level}</Text>}
        </View>

        <View style={styles.rightMetaColumn}>
          <IconButton
            icon={({ size, color: iconColor }) => <Icon source="dots-horizontal" size={size} color={iconColor} />}
            size={20}
            style={{ margin: 0, padding: 0 }}
            onPress={() => {}}
          />

          <View style={[styles.statusBadge, { backgroundColor: statusMeta.bg }]}>
            <Text style={[styles.statusText, { color: statusMeta.color }]}>{statusMeta.label}</Text>
          </View>

          <View style={styles.studentCountRow}>
            <Icon source="account" size={14} color="#64748B" />
            <Text style={styles.studentCountText}>{item.studentCount} học viên</Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
