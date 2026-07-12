import React, { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Icon, Text } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { StudentService } from '@tera/modules/education';

import { styles } from '../styles';
import { PANEL_TABS, SKILL_META } from '../constants';
import { formatDate, getRank, rankOf } from '../_utils';
import type { EvaluationEntry, PanelTab, StudentEvaluationRow, StudentSkills } from '../types';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

interface Props {
  student: StudentEvaluationRow | null;
  rows: StudentEvaluationRow[];
  comments: EvaluationEntry[];
  onAddEvaluation: () => void;
}

export const StudentDetailPanel = ({ student, rows, comments, onAddEvaluation }: Props) => {
  const router = useRouter();
  const [tab, setTab] = useState<PanelTab>('overview');

  const statsQuery = StudentService.useStudentStats(
    { id: student?.studentId ?? '' },
    { enabled: !!student },
  );
  const skills: Partial<StudentSkills> | undefined = (statsQuery.data as any)?.data?.skills;

  const rank = useMemo(() => (student ? rankOf(student.studentId, rows) : null), [student, rows]);
  const grade = getRank(student?.avgScore ?? null);

  if (!student) {
    return (
      <View style={styles.card}>
        <View style={{ alignItems: 'center', paddingVertical: 32, gap: 8 }}>
          <Icon source="account-search-outline" size={32} color="#CBD5E1" />
          <Text style={styles.emptyText}>Chọn một học viên để xem chi tiết</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.detailHeader}>
        <View style={styles.avatarCircle}>
          <Text style={styles.avatarText}>{initialOf(student.studentName)}</Text>
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={styles.detailName} numberOfLines={1}>
            {student.studentName}
          </Text>
          <Text style={styles.detailMeta} numberOfLines={1}>
            {student.studentCode}
            {student.className ? ` - ${student.className}` : ''}
          </Text>
        </View>
      </View>

      <View style={styles.panelTabsRow}>
        {PANEL_TABS.map((item) => {
          const active = item.key === tab;
          return (
            <TouchableOpacity
              key={item.key}
              style={[styles.panelTabItem, active && styles.panelTabItemActive]}
              onPress={() => setTab(item.key)}
            >
              <Text style={[styles.panelTabText, active && styles.panelTabTextActive]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {tab === 'comments' ? (
        comments.length === 0 ? (
          <Text style={styles.emptyText}>Chưa có nhận xét nào</Text>
        ) : (
          comments.map((c) => (
            <View key={c.id} style={styles.commentCard}>
              <View style={styles.commentBadgeRow}>
                {!!c.evaluationPeriodLabel && (
                  <View style={styles.commentBadge}>
                    <Text style={styles.commentBadgeText}>{c.evaluationPeriodLabel}</Text>
                  </View>
                )}
                {!!c.classificationLabel && (
                  <View style={[styles.commentBadge, { backgroundColor: '#EBF5FF' }]}>
                    <Text style={[styles.commentBadgeText, { color: '#007AFF' }]}>{c.classificationLabel}</Text>
                  </View>
                )}
              </View>
              <Text style={styles.commentText}>{c.comment || 'Không có nội dung nhận xét'}</Text>
              {!!c.evaluatedAt && <Text style={styles.commentDate}>{formatDate(c.evaluatedAt)}</Text>}
            </View>
          ))
        )
      ) : (
        <>
          <View style={styles.statTilesRow}>
            <View style={styles.statTile}>
              <View style={[styles.statTileIconBg, { backgroundColor: '#EBF5FF' }]}>
                <Icon source="file-document-outline" size={16} color="#007AFF" />
              </View>
              <Text style={styles.statTileValue}>{student.avgScore ?? '—'}</Text>
              <Text style={styles.statTileLabel}>Điểm TB</Text>
            </View>
            <View style={styles.statTile}>
              <View style={[styles.statTileIconBg, { backgroundColor: '#FFF4EB' }]}>
                <Icon source="trophy-outline" size={16} color="#E67E22" />
              </View>
              <Text style={styles.statTileValue}>{rank ? `${rank.rank}/${rank.total}` : '—'}</Text>
              <Text style={styles.statTileLabel}>Xếp hạng</Text>
            </View>
            <View style={styles.statTile}>
              <View style={[styles.statTileIconBg, { backgroundColor: '#F5EFFF' }]}>
                <Icon source="school-outline" size={16} color="#9B5DE5" />
              </View>
              <Text style={[styles.statTileValue, { color: grade.color }]}>
                {student.classificationLabel ?? grade.label}
              </Text>
              <Text style={styles.statTileLabel}>Xếp loại</Text>
            </View>
          </View>

          <Text style={styles.cardTitle}>Kỹ năng</Text>
          {statsQuery.isLoading ? (
            <ActivityIndicator style={{ paddingVertical: 12 }} />
          ) : (
            SKILL_META.map((meta) => {
              const percent = skills?.[meta.key] ?? 0;
              return (
                <View key={meta.key} style={styles.skillRow}>
                  <Icon source={meta.icon} size={16} color="#94A3B8" />
                  <View style={styles.skillInfo}>
                    <Text style={styles.skillLabel} numberOfLines={1}>
                      {meta.label}
                    </Text>
                    <View style={styles.skillTrack}>
                      <View style={[styles.skillFill, { width: `${Math.max(0, Math.min(100, percent))}%` }]} />
                    </View>
                  </View>
                  <Text style={styles.skillValue}>{(percent / 10).toFixed(1)}</Text>
                </View>
              );
            })
          )}

          <View style={styles.latestCommentCard}>
            <Text style={{ fontSize: 12, fontWeight: '700', color: '#334155', marginBottom: 4 }}>
              Nhận xét mới nhất
            </Text>
            <Text style={styles.latestCommentText}>{student.latestComment || 'Chưa có nhận xét'}</Text>
          </View>
        </>
      )}

      <Text
        style={[styles.linkText, { marginTop: 12 }]}
        onPress={() => router.push(`/student/student-detail?id=${student.studentId}`)}
      >
        Xem tất cả
      </Text>

      <Button mode="contained" icon="plus" style={styles.addBtn} onPress={onAddEvaluation}>
        Thêm nhận xét
      </Button>
    </View>
  );
};
