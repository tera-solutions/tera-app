import React, { useState } from 'react';
import { ActivityIndicator, View, ScrollView } from 'react-native';

import { useAssignmentList } from '@tera/modules/education/assignment';
import { getListData } from '@tera/commons/hooks';

import { styles } from './styles';
import { AssignmentHeader } from './components/AssignmentHeader';
import { QuickActions } from './components/QuickActions';
import { MetricsSummary } from './components/MetricsSummary';
import { FilterTabs } from './components/FilterTabs';
import { SearchBarSection } from './components/SearchBarSection';
import { AssignmentCard, AssignmentItem } from './components/AssignmentCard';
import { TeacherTipBanner } from './components/TeacherTipBanner';

import {
  AssignmentResponse,
  AssignmentApiStatus,
  AssignmentStats,
  AssignmentType,
} from './types';

// ─── Tab config ───────────────────────────────────────────────────────────────
const TABS = ['Tất cả', 'Đã giao', 'Bản nháp', 'Đã đóng'];

const TAB_STATUS_MAP: Record<string, AssignmentApiStatus | null> = {
  'Tất cả': null,
  'Đã giao': 'published',
  'Bản nháp': 'draft',
  'Đã đóng': 'closed',
};

// ─── Type → icon config ───────────────────────────────────────────────────────
const TYPE_CONFIG: Record<AssignmentType, { icon: string; iconBg: string; iconColor: string }> = {
  homework:      { icon: 'text-box-outline',       iconBg: '#EBF5FF', iconColor: '#007AFF' },
  worksheet:     { icon: 'file-document-outline',  iconBg: '#EBF7EE', iconColor: '#27AE60' },
  quiz:          { icon: 'help-circle-outline',    iconBg: '#FFF4EB', iconColor: '#E67E22' },
  writing:       { icon: 'pencil',                 iconBg: '#F5EFFF', iconColor: '#9B5DE5' },
  speaking:      { icon: 'microphone-outline',     iconBg: '#FFF0F3', iconColor: '#E74C3C' },
  listening:     { icon: 'headphones',             iconBg: '#FFF4EB', iconColor: '#E67E22' },
  reading:       { icon: 'book-open-outline',      iconBg: '#EEF6FA', iconColor: '#2980B9' },
  project:       { icon: 'folder-outline',         iconBg: '#F5EFFF', iconColor: '#9B5DE5' },
  exam_practice: { icon: 'clipboard-text-outline', iconBg: '#FFF0F3', iconColor: '#E74C3C' },
};

// ─── Status → badge ───────────────────────────────────────────────────────────
const STATUS_BADGE: Record<AssignmentApiStatus, { type: AssignmentItem['badgeType']; label: string }> = {
  draft:     { type: 'neutral',  label: 'Bản nháp' },
  published: { type: 'success',  label: 'Đã giao' },
  closed:    { type: 'warning',  label: 'Đã đóng' },
};

// ─── Date formatter ───────────────────────────────────────────────────────────
function formatDate(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;
}

// ─── Mapper ───────────────────────────────────────────────────────────────────
function mapToAssignmentItem(item: AssignmentResponse): AssignmentItem {
  const typeConfig = TYPE_CONFIG[item.assignment_type] ?? TYPE_CONFIG.homework;
  const status = item.status ?? 'draft';
  const badge = STATUS_BADGE[status];
  const submissions = item.submissions_count ?? 0;

  const progress =
    status === 'closed'
      ? 100
      : status === 'draft'
        ? 0
        : Math.min(submissions * 10, 95);

  return {
    id: String(item.id),
    title: item.assignment_name,
    classRoom: item.class?.name ?? item.course?.name ?? '',
    startDate: item.created_at ? formatDate(item.created_at) : '',
    endDate: item.due_date ? formatDate(item.due_date) : '',
    icon: typeConfig.icon,
    iconBg: typeConfig.iconBg,
    iconColor: typeConfig.iconColor,
    progress,
    badgeText: submissions > 0 ? `${badge.label} • ${submissions} bài` : badge.label,
    badgeType: badge.type,
  };
}

// ─── Screen ──────────────────────────────────────────────────────────────────
export default function AssignmentScreen() {
  const [activeTab, setActiveTab] = useState('Tất cả');

  const { data, isLoading, isFetching, refetch } = useAssignmentList({
    params: { per_page: 50 },
  });

  const { items, pagination } = getListData<AssignmentResponse>(data);

  const assignmentList = items.map(mapToAssignmentItem);

  // Filter by tab
  const statusFilter = TAB_STATUS_MAP[activeTab];
  const filtered = statusFilter
    ? items.filter((i) => i.status === statusFilter).map(mapToAssignmentItem)
    : assignmentList;

  // Stats
  const stats: AssignmentStats = {
    total:     pagination.total,
    published: items.filter((i) => i.status === 'published').length,
    draft:     items.filter((i) => i.status === 'draft').length,
    closed:    items.filter((i) => i.status === 'closed').length,
  };

  return (
    <View style={styles.container}>
      <AssignmentHeader />
      <QuickActions />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MetricsSummary stats={stats} />
        <FilterTabs
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <SearchBarSection />

        <View style={styles.listContainer}>
          {isLoading || isFetching ? (
            <ActivityIndicator size="large" color="#007AFF" style={{ marginVertical: 32 }} />
          ) : (
            filtered.map((item) => (
              <AssignmentCard key={item.id} item={item} />
            ))
          )}

          <TeacherTipBanner />
        </View>
      </ScrollView>
    </View>
  );
}
