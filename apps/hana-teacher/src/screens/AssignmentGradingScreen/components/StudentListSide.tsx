import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { StudentCardItem, StudentGradingData } from './StudentCardItem';

interface StudentListSideProps {
  students: StudentGradingData[];
  selectedId: string;
  onSelectStudent: (id: string) => void;
}

export const StudentListSide = ({
  students,
  selectedId,
  onSelectStudent,
}: StudentListSideProps) => (
  <View style={styles.leftColumn}>
    {/* Thanh Tìm Kiếm Trạng Thái */}
    <View style={styles.searchFilterContainer}>
      <View style={styles.searchBar}>
        <Icon source="magnify" size={18} color="#94A3B8" />
        <Text style={styles.searchInputText}>Tìm kiếm học viên...</Text>
      </View>
      <View style={styles.statusDropdown}>
        <Text style={styles.dropdownText}>Tất cả trạng thái</Text>
        <Icon source="menu-down" size={20} color="#007AFF" />
      </View>
    </View>

    {/* Danh sách cuộn Học Viên */}
    <ScrollView
      style={styles.studentScrollContainer}
      showsVerticalScrollIndicator={false}
    >
      {students.map((student) => (
        <StudentCardItem
          key={student.id}
          item={student}
          isActive={student.id === selectedId}
          onSelect={() => onSelectStudent(student.id)}
        />
      ))}
      <TouchableOpacity style={styles.showMoreStudentsBtn}>
        <Text style={styles.showMoreStudentsText}>Hiển thị 8/22 học viên</Text>
      </TouchableOpacity>
    </ScrollView>
  </View>
);
