import React from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import type { StudentEvaluationRow } from '../types';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

interface Props {
  rows: StudentEvaluationRow[];
  selectedId: number | null;
  onSelect: (row: StudentEvaluationRow) => void;
  search: string;
  onSearchChange: (value: string) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const StudentEvaluationList = ({
  rows,
  selectedId,
  onSelect,
  search,
  onSearchChange,
  isLoading,
  isError,
  onRetry,
}: Props) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>Danh sách học viên</Text>

    <View style={styles.searchRow}>
      <Icon source="magnify" size={18} color="#94A3B8" />
      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm học viên..."
        placeholderTextColor="#94A3B8"
        value={search}
        onChangeText={onSearchChange}
      />
    </View>

    {isLoading ? (
      <ActivityIndicator style={{ paddingVertical: 24 }} />
    ) : isError ? (
      <View style={{ alignItems: 'center', paddingVertical: 16, gap: 8 }}>
        <Icon source="alert-circle-outline" size={28} color="#E74C3C" />
        <Text style={styles.emptyText}>Không tải được danh sách học viên</Text>
        <Text style={styles.linkText} onPress={onRetry}>
          Thử lại
        </Text>
      </View>
    ) : rows.length === 0 ? (
      <Text style={styles.emptyText}>Lớp học chưa có học viên</Text>
    ) : (
      rows.map((row) => {
        const active = row.studentId === selectedId;
        return (
          <TouchableOpacity
            key={row.studentId}
            style={[styles.studentRow, active && styles.studentRowActive]}
            onPress={() => onSelect(row)}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{initialOf(row.studentName)}</Text>
            </View>
            <View style={styles.studentInfo}>
              <Text style={styles.studentName} numberOfLines={1}>
                {row.studentName || '—'}
              </Text>
              <Text style={styles.studentMeta} numberOfLines={1}>
                {row.latestComment || 'Chưa có nhận xét'}
              </Text>
            </View>
            <Text style={styles.studentScore}>{row.avgScore ?? '—'}</Text>
          </TouchableOpacity>
        );
      })
    )}
  </View>
);
