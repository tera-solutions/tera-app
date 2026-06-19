import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

const ACTIVITIES = [
  { id: '1', step: '1', title: 'Warm-up', time: '5 phút', desc: 'Giới thiệu chủ đề và làm quen từ vựng bằng hình ảnh và trò chơi.', status: 'done', label: 'Hoàn thành' },
  { id: '2', step: '2', title: 'Presentation', time: '10 phút', desc: 'Giới thiệu từ mới và mẫu câu qua tranh minh họa và audio.', status: 'done', label: 'Hoàn thành' },
  { id: '3', step: '3', title: 'Practice', time: '15 phút', desc: 'Thực hành hội thoại theo cặp và hoạt động nhóm nhỏ.', status: 'done', label: 'Hoàn thành' },
  { id: '4', step: '4', title: 'Production', time: '10 phút', desc: 'Học sinh thực hành giới thiệu bản thân trước lớp.', status: 'pending', label: 'Sắp tới' },
  { id: '5', step: '5', title: 'Wrap-up', time: '5 phút', desc: 'Ôn lại kiến thức và đánh giá nhanh.', status: 'pending', label: 'Sắp tới' },
];

export const ActivityList = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Icon source="vector-polyline" size={22} color="#007AFF" />
        <Text style={styles.sectionTitle}>Hoạt động trong bài</Text>
      </View>
      <TouchableOpacity><Text style={styles.viewAllText}>Xem tất cả</Text></TouchableOpacity>
    </View>

    <View style={styles.activityList}>
      {ACTIVITIES.map((act, index) => {
        const isDone = act.status === 'done';
        return (
          <View key={act.id} style={[styles.activityItem, index < ACTIVITIES.length - 1 && styles.activityBorder]}>
            <View style={[styles.activityStep, { backgroundColor: isDone ? '#007AFF' : '#E2E8F0' }]}>
              <Text style={[styles.activityStepText, { color: isDone ? '#FFFFFF' : '#64748B' }]}>{act.step}</Text>
            </View>
            <View style={styles.activityIconBg}>
              <Icon source={act.title === 'Presentation' ? 'headphones' : 'account-group-outline'} size={20} color="#64748B" />
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>{act.title} <Text style={styles.activityTime}>({act.time})</Text></Text>
              <Text style={styles.activityDesc}>{act.desc}</Text>
            </View>
            <View style={[styles.badgeStatus, { backgroundColor: isDone ? '#E2FBEB' : '#EBF5FF' }]}>
              <Text style={[styles.badgeStatusText, { color: isDone ? '#27AE60' : '#007AFF' }]}>{act.label}</Text>
            </View>
            <Icon source="chevron-right" size={20} color="#94A3B8" />
          </View>
        );
      })}
    </View>
  </View>
);