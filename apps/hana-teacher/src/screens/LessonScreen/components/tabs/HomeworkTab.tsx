import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';
import moment from 'moment';

import { AssignmentService } from '@tera/modules/education';
import { getListData } from '@tera/commons/hooks';

import { ASSIGNMENT_STATUS_CONFIG } from '../../constants';
import type { AssignmentResponse } from '@screens/AssignmentScreen/types';
import type { LessonDetail } from '../../types';
import { styles } from '../../styles';

interface Props {
  detail: LessonDetail;
}

export const HomeworkTab = ({ detail }: Props) => {
  const router = useRouter();

  const { data, isLoading } = AssignmentService.useAssignmentList({
    params: { per_page: 50, filters: { lesson_id: detail.id } },
  });
  const { items } = getListData<AssignmentResponse>(data);

  const handleCreate = () => {
    router.push(
      `/edu/assignment-create?lessonId=${detail.id}&classId=${detail.class_room_id}&lessonTitle=${encodeURIComponent(
        detail.unit ? `${detail.unit} - ${detail.lesson_title}` : detail.lesson_title,
      )}&className=${encodeURIComponent(detail.class_name)}` as any,
    );
  };

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.homeworkHeaderRow}>
        <View style={styles.sectionTitleRow}>
          <Icon source="clipboard-text-outline" size={20} color="#007AFF" />
          <Text style={styles.sectionTitle}>Bài tập gắn với buổi học</Text>
        </View>
        <TouchableOpacity style={styles.createHomeworkBtn} onPress={handleCreate}>
          <Icon source="plus" size={14} color="#FFFFFF" />
          <Text style={styles.createHomeworkBtnText}>Giao bài tập</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator style={{ paddingVertical: 24 }} />
      ) : items.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có bài tập nào cho buổi học này.</Text>
      ) : (
        items.map((item) => {
          const cfg = ASSIGNMENT_STATUS_CONFIG[item.status ?? 'draft'] ?? ASSIGNMENT_STATUS_CONFIG.draft;
          const overdue = item.due_date ? moment(item.due_date).isBefore(moment()) : false;
          return (
            <TouchableOpacity
              key={item.id}
              style={styles.homeworkItem}
              activeOpacity={0.7}
              onPress={() => router.push(`/edu/assignment-detail?id=${item.id}` as any)}
            >
              <View style={styles.homeworkIconBg}>
                <Icon source="file-document-outline" size={18} color="#007AFF" />
              </View>
              <View style={styles.homeworkBody}>
                <Text style={styles.homeworkName} numberOfLines={1}>
                  {item.assignment_name}
                </Text>
                <Text style={[styles.homeworkDue, { color: overdue ? '#E74C3C' : '#94A3B8' }]}>
                  {item.due_date ? `Hạn nộp: ${moment(item.due_date).format('DD/MM/YYYY HH:mm')}` : 'Chưa có hạn nộp'}
                </Text>
              </View>
              <View style={[styles.activityStatusBadge, { backgroundColor: cfg.bg, marginLeft: 0 }]}>
                <Text style={[styles.activityStatusText, { color: cfg.color }]}>{cfg.label}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};
