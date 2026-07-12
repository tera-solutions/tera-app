import React from 'react';
import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import type { LessonDetail } from '../types';
import { styles } from '../styles';

interface Props {
  detail: LessonDetail;
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoRowLabel}>{label}</Text>
    <Text style={styles.infoRowValue}>{value || '—'}</Text>
  </View>
);

export const InfoSidebarCard = ({ detail }: Props) => {
  const updatedLabel = [detail.updated_at, detail.updated_by && `bởi ${detail.updated_by}`]
    .filter(Boolean)
    .join(' ');

  return (
    <View style={styles.sidebarCard}>
      <View style={styles.sectionTitleRow}>
        <Icon source="information-outline" size={18} color="#007AFF" />
        <Text style={styles.sectionTitle}>Thông tin bài học</Text>
      </View>
      <View style={{ marginTop: 10 }}>
        <Row label="Khóa học" value={detail.course_name} />
        <Row label="Cấp độ" value={detail.level} />
        <Row label="Đối tượng" value={detail.audience} />
        <Row label="Thời lượng" value={detail.duration ? `${detail.duration} phút` : ''} />
        {!!detail.created_at && <Row label="Ngày tạo" value={detail.created_at} />}
        {!!updatedLabel && <Row label="Cập nhật lần cuối" value={updatedLabel} />}
      </View>
    </View>
  );
};
