import React from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { LessonResponse, LessonApiStatus } from '../types';

// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG: Record<
  LessonApiStatus,
  { label: string; color: string; bg: string; icon: string }
> = {
  completed: { label: 'Đã giảng',       color: '#27AE60', bg: '#E2FBEB', icon: 'check-circle' },
  upcoming:  { label: 'Sắp tới',        color: '#007AFF', bg: '#EBF5FF', icon: 'clock-outline' },
  ongoing:   { label: 'Đang diễn ra',   color: '#E67E22', bg: '#FFF4EB', icon: 'play-circle-outline' },
  cancelled: { label: 'Đã hủy',         color: '#E74C3C', bg: '#FDF2F0', icon: 'close-circle-outline' },
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

function formatTime(t: string): string {
  return t.slice(0, 5); // "HH:mm:ss" → "HH:mm"
}

// ─── Component ───────────────────────────────────────────────────────────────
interface Props {
  lesson?: LessonResponse;
  isLoading?: boolean;
}

export const LessonInfoCard = ({ lesson, isLoading }: Props) => {
  if (isLoading) {
    return (
      <View style={[styles.infoCard, { alignItems: 'center', paddingVertical: 32 }]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const status = lesson?.status ?? 'upcoming';
  const statusCfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.upcoming;
  const title = lesson
    ? `Buổi ${lesson.lesson_no}: ${lesson.lesson_title}`
    : 'Hello! – Getting to know you';
  const dateText = lesson?.lesson_date ? formatDate(lesson.lesson_date) : '10/05/2025';
  const timeText = lesson
    ? `${formatTime(lesson.start_time)} - ${formatTime(lesson.end_time)}`
    : '45 phút';
  const className = lesson?.class?.name ?? 'Starters 2A';

  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardTop}>
        <View style={styles.lessonImageBg}>
          <Icon source="alphabetical-variant" size={36} color="#FFB300" />
        </View>
        <View style={styles.lessonMeta}>
          <View style={styles.lessonTitleRow}>
            <Text style={styles.lessonTitle} numberOfLines={2}>{title}</Text>
            <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
              <Text style={[styles.statusText, { color: statusCfg.color }]}>
                {statusCfg.label}
              </Text>
              <Icon source={statusCfg.icon} size={14} color={statusCfg.color} />
            </View>
          </View>
          <View style={styles.unitTag}>
            <Text style={styles.unitText}>{className}</Text>
          </View>
        </View>
      </View>

      <View style={styles.gridInfo}>
        <View style={styles.gridItem}>
          <Icon source="clock-outline" size={16} color="#007AFF" />
          <Text style={styles.gridText}>{timeText}</Text>
        </View>
        <View style={styles.gridItem}>
          <Icon source="account-child-outline" size={16} color="#007AFF" />
          <Text style={styles.gridText}>{className}</Text>
        </View>
        <View style={styles.gridItem}>
          <Icon source="calendar-blank" size={16} color="#007AFF" />
          <Text style={styles.gridText}>{dateText}</Text>
        </View>
        <View style={styles.gridItem}>
          <Icon source="lock-outline" size={16} color="#007AFF" />
          <Text style={styles.gridText}>
            {lesson?.is_locked ? 'Đã khóa' : 'Chưa khóa'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Icon source="square-edit-outline" size={28} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};
