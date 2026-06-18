import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

export const ScheduleStats: React.FC = () => {
  const stats = [
    {
      label: 'Buổi dạy',
      value: '6',
      icon: 'book-open-variant',
      color: '#3B82F6',
    },
    {
      label: 'Lớp học',
      value: '4',
      icon: 'account-group-outline',
      color: '#10B981',
    },
    {
      label: 'Tổng thời gian',
      value: '6.0h',
      icon: 'clock-outline',
      color: '#F97316',
    },
    {
      label: 'Buổi đã dạy',
      value: '0',
      icon: 'checkbox-marked-circle-outline',
      color: '#8B5CF6',
    },
  ];

  return (
    <View style={styles.statsGrid}>
      {stats.map((item, idx) => (
        <View
          key={idx}
          style={[
            styles.statColumn,
            idx === stats.length - 1 && { borderRightWidth: 0 },
          ]}
        >
          <Icon source={item.icon} size={22} color={item.color} />
          <Text style={styles.statValue}>{item.value}</Text>
          <Text style={styles.statLabel}>{item.label}</Text>
          <Text style={styles.statPeriod}>Hôm nay</Text>
        </View>
      ))}
    </View>
  );
};
