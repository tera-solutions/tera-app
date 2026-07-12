import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Icon, ActivityIndicator } from 'react-native-paper';

import { LessonRow, LessonStatusTab } from '../types';
import { LESSON_STATUS_CONFIG } from '../constants';
import { styles } from '../styles';
import StatusTabs from './StatusTabs';

interface Props {
  rows: LessonRow[];
  activeTab: LessonStatusTab;
  onTabChange: (tab: LessonStatusTab) => void;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  onRetry: () => void;
  onView: (row: LessonRow) => void;
  onCancel: (row: LessonRow) => void;
}

const CANCELABLE: LessonRow['status'][] = ['upcoming', 'ongoing'];

export default function LessonListCard({
  rows,
  activeTab,
  onTabChange,
  search,
  onSearchChange,
  isLoading,
  isFetching,
  isError,
  onRetry,
  onView,
  onCancel,
}: Props) {
  return (
    <View style={styles.sectionCard}>
      <StatusTabs activeTab={activeTab} onTabChange={onTabChange} />

      <View style={styles.searchRow}>
        <Icon source="magnify" size={16} color="#94A3B8" />
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm theo tên bài học..."
          placeholderTextColor="#94A3B8"
          value={search}
          onChangeText={onSearchChange}
        />
      </View>

      {isError ? (
        <View style={styles.emptyWrapper}>
          <Icon source="alert-circle-outline" size={28} color="#E74C3C" />
          <Text style={styles.emptyText}>Không tải được danh sách bài học</Text>
          <Text style={styles.retryText} onPress={onRetry}>
            Thử lại
          </Text>
        </View>
      ) : isLoading ? (
        <ActivityIndicator style={{ paddingVertical: 24 }} />
      ) : rows.length === 0 ? (
        <View style={styles.emptyWrapper}>
          <Icon source="calendar-blank-outline" size={28} color="#CBD5E1" />
          <Text style={styles.emptyText}>Chưa có bài học nào</Text>
        </View>
      ) : (
        rows.map((row) => {
          const statusCfg = LESSON_STATUS_CONFIG[row.status] ?? LESSON_STATUS_CONFIG.upcoming;
          return (
            <TouchableOpacity key={row.id} style={styles.rowItem} onPress={() => onView(row)} activeOpacity={0.7}>
              <View style={styles.rowNoBadge}>
                <Text style={styles.rowNoText}>{String(row.lessonNo).padStart(2, '0')}</Text>
              </View>
              <View style={styles.rowBody}>
                <Text style={styles.rowTitle} numberOfLines={1}>
                  {row.lessonTitle || '—'}
                  {row.isLocked ? '  🔒' : ''}
                </Text>
                <Text style={styles.rowSubtitle} numberOfLines={1}>
                  {row.duration ? `Thời gian: ${row.duration} phút` : ''}
                </Text>
              </View>
              <View style={styles.rowRight}>
                <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                  <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>{statusCfg.label}</Text>
                </View>
                {!!row.date && <Text style={styles.rowRightText}>{row.date}</Text>}
              </View>
              {CANCELABLE.includes(row.status) && (
                <TouchableOpacity
                  style={styles.rowMenuBtn}
                  onPress={(e) => {
                    e.stopPropagation();
                    onCancel(row);
                  }}
                >
                  <Icon source="close-circle-outline" size={20} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </TouchableOpacity>
          );
        })
      )}

      {isFetching && !isLoading && (
        <ActivityIndicator style={{ marginTop: 8 }} size="small" color="#0066CC" />
      )}
    </View>
  );
}
