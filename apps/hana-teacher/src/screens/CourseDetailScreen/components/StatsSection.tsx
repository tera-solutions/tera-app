import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { CourseStats } from '../types';
import { styles } from '../styles';

interface StatBox {
  iconName: string;
  iconBg: string;
  iconColor: string;
  value: string | number;
  label: string;
}

interface Props {
  stats: CourseStats;
}

export default function StatsSection({ stats }: Props) {
  const boxes: StatBox[] = [
    {
      iconName: 'account-group-outline',
      iconBg: '#EEF5FF',
      iconColor: '#0066CC',
      value: stats.totalStudents,
      label: 'Học viên',
    },
    {
      iconName: 'check-decagram-outline',
      iconBg: '#F0FDF4',
      iconColor: '#22C55E',
      value: stats.completedStudents,
      label: 'Đã hoàn thành',
    },
    {
      iconName: 'google-classroom',
      iconBg: '#F5F3FF',
      iconColor: '#8B5CF6',
      value: stats.totalClasses,
      label: 'Lớp học',
    },
    {
      iconName: 'chart-donut',
      iconBg: '#FFF7ED',
      iconColor: '#F59E0B',
      value: `${stats.completionRate}%`,
      label: 'Tỷ lệ hoàn thành',
    },
  ];

  return (
    <View style={styles.statsGrid}>
      {boxes.map((box) => (
        <View key={box.label} style={styles.statBox}>
          <View style={[styles.statIconWrap, { backgroundColor: box.iconBg }]}>
            <Icon source={box.iconName} size={18} color={box.iconColor} />
          </View>
          <Text style={styles.statValue}>{box.value}</Text>
          <Text style={styles.statLabel}>{box.label}</Text>
        </View>
      ))}
    </View>
  );
}
