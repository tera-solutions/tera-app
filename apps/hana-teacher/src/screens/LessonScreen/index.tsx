import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { styles } from './styles';
import { HeaderSection } from './components/HeaderSection';
import { LessonInfoCard } from './components/LessonInfoCard';
import { TabNavigation } from './components/TabNavigation';
import { StatsSummary } from './components/StatsSummary';
import { LessonObjectives } from './components/LessonObjectives';
import { MaterialList } from './components/MaterialList';
import { ActivityList } from './components/ActivityList';
import { BottomActions } from './components/BottomActions';

const TABS = ['Tổng quan', 'Nội dung', 'Hoạt động', 'Tài liệu', 'Ghi chú'];

export default function LessonScreen() {
  const [activeTab, setActiveTab] = useState('Tổng quan');

  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        <HeaderSection />
        <LessonInfoCard />
        <TabNavigation tabs={TABS} activeTab={activeTab} setActiveTab={setActiveTab} />
        
        {/* Render theo Tab - Hiện tại hiển thị block thông tin tổng quan của ảnh 'bai hoc.png' */}
        {activeTab === 'Tổng quan' && (
          <>
            <StatsSummary />
            <LessonObjectives />
            <MaterialList />
            <ActivityList />
          </>
        )}
      </ScrollView>

      {/* Cố định nút điều hướng cuối màn hình */}
      <BottomActions />
    </View>
  );
}