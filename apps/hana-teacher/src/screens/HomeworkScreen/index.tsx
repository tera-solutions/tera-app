import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { styles } from './styles';
import { HomeworkHeader } from './components/HomeworkHeader';
import { QuickActions } from './components/QuickActions';
import { MetricsSummary } from './components/MetricsSummary';
import { FilterTabs } from './components/FilterTabs';
import { SearchBarSection } from './components/SearchBarSection';
import { HomeworkCard, HomeworkItem } from './components/HomeworkCard';
import { TeacherTipBanner } from './components/TeacherTipBanner';

const TABS = ['Tất cả', 'Đã giao', 'Đã thu bài', 'Bản nháp'];

const MOCK_HOMEWORKS: HomeworkItem[] = [
  {
    id: '1',
    title: 'Bài 1: Từ vựng chủ đề Gia đình',
    classRoom: 'Lớp Starters 2A',
    startDate: '15/05/2025',
    endDate: '22/05/2025',
    icon: 'text-box-outline',
    iconBg: '#EBF5FF',
    iconColor: '#007AFF',
    progress: 82,
    badgeText: 'Đã nộp 18/22',
    badgeType: 'success',
  },
  {
    id: '2',
    title: 'Bài 2: Nghe hiểu – School',
    classRoom: 'Lớp Starters 2A',
    startDate: '12/05/2025',
    endDate: '19/05/2025',
    icon: 'headphones',
    iconBg: '#FFF4EB',
    iconColor: '#E67E22',
    progress: 91,
    badgeText: 'Đã nộp 20/22',
    badgeType: 'success',
  },
  {
    id: '3',
    title: 'Bài 3: Ngứ pháp – To be',
    classRoom: 'Lớp Movers 1B',
    startDate: '14/05/2025',
    endDate: '21/05/2025',
    icon: 'pencil',
    iconBg: '#F5EFFF',
    iconColor: '#9B5DE5',
    progress: 72,
    badgeText: 'Chưa nộp 5/18',
    badgeType: 'warning',
  },
  {
    id: '4',
    title: 'Bài 4: Đọc hiểu – My day',
    classRoom: 'Lớp Flyers 3A',
    startDate: '10/05/2025',
    endDate: '17/05/2025',
    icon: 'file-document-outline',
    iconBg: '#EBF7EE',
    iconColor: '#27AE60',
    progress: 40,
    badgeText: 'Quá hạn 2/20',
    badgeType: 'danger',
  },
  {
    id: '5',
    title: 'Bài 5: Viết đoạn văn ngắn',
    classRoom: 'Lớp Starters 2A',
    startDate: '16/05/2025',
    endDate: '23/05/2025',
    icon: 'image-outline',
    iconBg: '#EEF6FA',
    iconColor: '#2980B9',
    progress: 100,
    badgeText: 'Đã thu bài',
    badgeType: 'neutral',
  },
];

export default function HomeworkScreen() {
  const [activeTab, setActiveTab] = useState('Tất cả');

  return (
    <View style={styles.container}>
      <HomeworkHeader />
      <QuickActions />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <MetricsSummary />
        <FilterTabs
          tabs={TABS}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <SearchBarSection />

        {/* Danh sách bài tập */}
        <View style={styles.listContainer}>
          {MOCK_HOMEWORKS.map((item) => (
            <HomeworkCard key={item.id} item={item} />
          ))}

          {/* Mẹo hệ thống dưới cùng list */}
          <TeacherTipBanner />
        </View>
      </ScrollView>
    </View>
  );
}
