import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { Icon, Modal, Portal } from 'react-native-paper';
import { styles } from '../styles';
import { STATUS_FILTERS } from '../constants';
import { isGraded } from '../_utils';
import { StudentCardItem } from './StudentCardItem';
import type { SubmissionRow } from '../types';

interface StudentListSideProps {
  students: SubmissionRow[];
  selectedId: number | null;
  onSelectStudent: (row: SubmissionRow) => void;
}

type StatusFilterValue = (typeof STATUS_FILTERS)[number]['value'];

const matchesStatusFilter = (row: SubmissionRow, filter: StatusFilterValue) => {
  if (filter === 'all') return true;
  if (filter === 'graded') return isGraded(row.status);
  if (filter === 'pending') return row.status === 'assigned';
  return row.status === 'submitted' || row.status === 'late_submitted';
};

export const StudentListSide = ({ students, selectedId, onSelectStudent }: StudentListSideProps) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilterValue>('all');
  const [menuVisible, setMenuVisible] = useState(false);

  const filtered = useMemo(
    () =>
      students.filter(
        (s) =>
          matchesStatusFilter(s, statusFilter) &&
          s.studentName.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [students, search, statusFilter],
  );

  const statusLabel = STATUS_FILTERS.find((f) => f.value === statusFilter)?.label ?? 'Tất cả trạng thái';

  return (
    <View style={styles.leftColumn}>
      <View style={styles.searchFilterContainer}>
        <View style={styles.searchBar}>
          <Icon source="magnify" size={18} color="#94A3B8" />
          <TextInput
            style={[styles.searchInputText, { color: '#1E293B' }]}
            placeholder="Tìm kiếm học viên..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>
        <TouchableOpacity style={styles.statusDropdown} onPress={() => setMenuVisible(true)}>
          <Text style={styles.dropdownText} numberOfLines={1}>
            {statusLabel}
          </Text>
          <Icon source="menu-down" size={20} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <Text style={{ fontSize: 11, color: '#94A3B8', marginBottom: 8 }}>
        Hiển thị {filtered.length}/{students.length} học viên
      </Text>

      <ScrollView style={styles.studentScrollContainer} showsVerticalScrollIndicator={false}>
        {filtered.length === 0 ? (
          <Text style={styles.emptyStateText}>Không có học viên phù hợp</Text>
        ) : (
          filtered.map((student, index) => (
            <StudentCardItem
              key={student.id}
              item={student}
              index={index}
              isActive={student.id === selectedId}
              onSelect={() => onSelectStudent(student)}
            />
          ))
        )}
      </ScrollView>

      <Portal>
        <Modal
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          contentContainerStyle={styles.statusModalContainer}
        >
          {STATUS_FILTERS.map((option) => {
            const active = option.value === statusFilter;
            return (
              <TouchableOpacity
                key={option.value}
                style={[styles.statusOption, active && styles.statusOptionActive]}
                onPress={() => {
                  setStatusFilter(option.value);
                  setMenuVisible(false);
                }}
              >
                <Text style={[styles.statusOptionText, active && styles.statusOptionTextActive]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Modal>
      </Portal>
    </View>
  );
};
