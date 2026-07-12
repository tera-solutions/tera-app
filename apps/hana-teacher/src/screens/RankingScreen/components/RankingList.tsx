import React from 'react';
import { View } from 'react-native';
import { ActivityIndicator, Icon, Text } from 'react-native-paper';

import { styles } from '../styles';
import { MEDAL_COLOR } from '../constants';
import { Sparkline } from './Sparkline';
import type { RankingRow } from '../types';

const initialOf = (name: string) => (name.trim().charAt(0) || '?').toUpperCase();

interface Props {
  rows: RankingRow[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export const RankingList = ({ rows, isLoading, isError, onRetry }: Props) => {
  if (isLoading) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bảng xếp hạng</Text>
        <ActivityIndicator style={{ paddingVertical: 24 }} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Bảng xếp hạng</Text>
        <View style={{ alignItems: 'center', paddingVertical: 16, gap: 8 }}>
          <Icon source="alert-circle-outline" size={28} color="#E74C3C" />
          <Text style={styles.emptyText}>Không tải được bảng xếp hạng</Text>
          <Text style={{ color: '#007AFF', fontWeight: '600', fontSize: 13 }} onPress={onRetry}>
            Thử lại
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>Bảng xếp hạng</Text>
      {rows.length === 0 ? (
        <Text style={styles.emptyText}>Chưa có dữ liệu đánh giá để xếp hạng</Text>
      ) : (
        rows.map((row, i) => {
          const rank = i + 1;
          return (
            <View key={row.studentId} style={[styles.rankRow, rank <= 3 && styles.rankRowHighlight]}>
              {rank <= 3 ? (
                <View
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: MEDAL_COLOR[rank - 1],
                  }}
                >
                  <Text style={{ fontSize: 11, fontWeight: '700', color: '#FFF' }}>{rank}</Text>
                </View>
              ) : (
                <Text style={styles.rankBadgeNum}>{rank}</Text>
              )}

              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initialOf(row.studentName)}</Text>
              </View>

              <View style={styles.rankInfo}>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#0F172A' }} numberOfLines={1}>
                  {row.studentName}
                </Text>
                <Text style={{ fontSize: 11, color: '#94A3B8' }} numberOfLines={1}>
                  {row.className || '—'}
                </Text>
                {!!row.classificationLabel && (
                  <View style={styles.classificationBadge}>
                    <Text style={styles.classificationText}>{row.classificationLabel}</Text>
                  </View>
                )}
              </View>

              <Sparkline values={row.history} />
              <Text style={styles.rankScore}>{row.score ?? '—'}</Text>
            </View>
          );
        })
      )}
    </View>
  );
};
