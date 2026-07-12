import React, { useMemo, useState } from 'react';
import { TextInput, TouchableOpacity, View } from 'react-native';
import { Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import type { RankingRow } from '../types';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

interface Props {
  rows: RankingRow[];
}

/** Ad-hoc, session-only comparison group — no backend persistence, matches the web page. */
export const GroupCompareCard = ({ rows }: Props) => {
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    if (!keyword) return rows;
    return rows.filter((r) => r.studentName.toLowerCase().includes(keyword));
  }, [rows, search]);

  const toggle = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const groupRows = rows.filter((r) => selected.has(r.studentId) && r.score != null);
  const groupAvg = groupRows.length
    ? groupRows.reduce((sum, r) => sum + (r.score as number), 0) / groupRows.length
    : 0;
  const overallScored = rows.filter((r) => r.score != null);
  const overallAvg = overallScored.length
    ? overallScored.reduce((sum, r) => sum + (r.score as number), 0) / overallScored.length
    : 0;

  return (
    <>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Chọn nhóm học viên</Text>
        <View style={styles.searchRow}>
          <Icon source="magnify" size={18} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm kiếm học viên để thêm vào nhóm..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {filtered.length === 0 ? (
          <Text style={styles.emptyText}>Không tìm thấy học viên phù hợp</Text>
        ) : (
          <View style={styles.groupGrid}>
            {filtered.map((row) => {
              const checked = selected.has(row.studentId);
              return (
                <TouchableOpacity
                  key={row.studentId}
                  style={[styles.groupChip, checked && styles.groupChipActive]}
                  onPress={() => toggle(row.studentId)}
                >
                  <View style={styles.avatarCircle}>
                    <Text style={styles.avatarText}>{initialOf(row.studentName)}</Text>
                  </View>
                  <Text style={styles.groupChipText} numberOfLines={1}>
                    {row.studentName}
                  </Text>
                  {checked && <Icon source="check-circle" size={16} color="#007AFF" />}
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.groupStatsRow}>
        <View style={styles.statCard}>
          <Icon source="check-decagram-outline" size={20} color="#007AFF" />
          <Text style={[styles.statValue, { color: '#007AFF' }]}>{selected.size}</Text>
          <Text style={styles.statLabel}>Đã chọn</Text>
        </View>
        <View style={styles.statCard}>
          <Icon source="chart-line" size={20} color="#27AE60" />
          <Text style={[styles.statValue, { color: '#27AE60' }]}>{groupRows.length ? groupAvg.toFixed(2) : '—'}</Text>
          <Text style={styles.statLabel}>Điểm TB nhóm</Text>
          <Text style={styles.statSublabel}>So với TB chung: {overallAvg.toFixed(2)}</Text>
        </View>
      </View>
    </>
  );
};
