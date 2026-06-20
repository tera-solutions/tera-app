import React, { useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { styles } from './styles';
import { GradingHeader } from './components/GradingHeader';
import { AssignmentInfo } from './components/AssignmentInfo';
import { GradingMetrics } from './components/GradingMetrics';
import { GradingTabs } from './components/GradingTabs';
import { StudentListSide } from './components/StudentListSide';
import { DetailGradingSide } from './components/DetailGradingSide';
import { GradingFooter } from './components/GradingFooter';
import { StudentGradingData } from './components/StudentCardItem';

const MOCK_STUDENTS: StudentGradingData[] = [
  {
    id: '1',
    index: '01',
    name: 'Nguyễn Minh Anh',
    avatar: 'https://placeholder.co/100',
    score: '8.5',
    status: 'submitted',
    statusLabel: 'Đã nộp',
  },
  {
    id: '2',
    index: '02',
    name: 'Trần Bảo Châu',
    avatar: 'https://placeholder.co/100',
    score: '9.0',
    status: 'submitted',
    statusLabel: 'Đã nộp',
  },
  {
    id: '3',
    index: '03',
    name: 'Lê Gia Huy',
    avatar: 'https://placeholder.co/100',
    score: '7.5',
    status: 'submitted',
    statusLabel: 'Đã nộp',
  },
  {
    id: '4',
    index: '04',
    name: 'Phạm Khánh Linh',
    avatar: 'https://placeholder.co/100',
    score: '8.0',
    status: 'submitted',
    statusLabel: 'Đã nộp',
  },
  {
    id: '5',
    index: '05',
    name: 'Hoàng Đức Mạnh',
    avatar: 'https://placeholder.co/100',
    score: null,
    status: 'pending',
    statusLabel: 'Chưa nộp',
  },
  {
    id: '6',
    index: '06',
    name: 'Vũ Quỳnh Anh',
    avatar: 'https://placeholder.co/100',
    score: null,
    status: 'pending',
    statusLabel: 'Chưa nộp',
  },
  {
    id: '7',
    index: '07',
    name: 'Đỗ Thành Nam',
    avatar: 'https://placeholder.co/100',
    score: '6.5',
    status: 'submitted',
    statusLabel: 'Đã nộp',
  },
  {
    id: '8',
    index: '08',
    name: 'Bùi Ngọc Diệp',
    avatar: 'https://placeholder.co/100',
    score: '9.5',
    status: 'submitted',
    statusLabel: 'Đã nộp',
  },
];

export default function AssignmentGradingScreen() {
  const [activeTab, setActiveTab] = useState('list');
  const [selectedStudentId, setSelectedStudentId] = useState('1');

  const currentStudent =
    MOCK_STUDENTS.find((s) => s.id === selectedStudentId) || MOCK_STUDENTS[0];
  const isTablet = Dimensions.get('window').width > 600;

  return (
    <View style={styles.container}>
      <GradingHeader />
      <AssignmentInfo />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <GradingMetrics />
        <GradingTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === 'list' && (
          <View style={styles.mainContentLayout}>
            <StudentListSide
              students={MOCK_STUDENTS}
              selectedId={selectedStudentId}
              onSelectStudent={setSelectedStudentId}
            />

            {(isTablet || selectedStudentId) && (
              <DetailGradingSide currentStudent={currentStudent} />
            )}
          </View>
        )}
      </ScrollView>

      <GradingFooter />
    </View>
  );
}
