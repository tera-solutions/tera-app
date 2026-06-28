import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';
import { LessonPlanStats } from '../types';

interface Props {
  stats?: LessonPlanStats;
}

export const StatisticCards: React.FC<Props> = ({ stats }) => {
  const items = [
    {
      label: 'Tổng giáo án',
      value: String(stats?.total ?? 0),
      icon: 'file-document-outline',
      bg: '#EFF6FF',
      iconColor: '#3B82F6',
    },
    {
      label: 'Đã xuất bản',
      value: String(stats?.published ?? 0),
      icon: 'checkbox-marked-circle-outline',
      bg: '#ECFDF5',
      iconColor: '#10B981',
    },
    {
      label: 'Đang duyệt',
      value: String(stats?.reviewing ?? 0),
      icon: 'clock-outline',
      bg: '#FFF7ED',
      iconColor: '#F97316',
    },
    {
      label: 'Tiến độ',
      value: `${stats?.progressPercent ?? 0}%`,
      icon: 'calendar-month-outline',
      bg: '#F5F3FF',
      iconColor: '#8B5CF6',
    },
  ];

  return (
    <View style={styles.statsGrid}>
      {items.map((item, idx) => (
        <View key={idx} style={[styles.statCard, { backgroundColor: item.bg }]}>
          <Icon source={item.icon} size={22} color={item.iconColor} />
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
};
