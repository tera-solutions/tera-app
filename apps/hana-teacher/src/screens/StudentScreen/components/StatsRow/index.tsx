import { Text, View } from 'react-native';
import { Users, UserCheck, UserX } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { ClassInfo } from '../../types';
import { styles } from '../../styles';

interface StatsRowProps {
  info: ClassInfo;
  totalStudents?: number; // override từ API pagination.total
}

interface StatBoxProps {
  icon: React.ReactNode;
  iconBg: string;
  value: string;
  label: string;
  sublabel: string;
}

function StatBox({ icon, iconBg, value, label, sublabel }: StatBoxProps) {
  return (
    <View style={styles.statBox}>
      <View style={[styles.statIcon, { backgroundColor: iconBg }]}>{icon}</View>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statSublabel}>{sublabel}</Text>
    </View>
  );
}

export default function StatsRow({ info, totalStudents }: StatsRowProps) {
  return (
    <View style={styles.statsRow}>
      <StatBox
        icon={<Users size={18} color="#2196F3" />}
        iconBg="#EAF4FF"
        value={String(totalStudents ?? info.totalStudents)}
        label="Học viên"
        sublabel="Tổng số"
      />
      <StatBox
        icon={<UserCheck size={18} color="#22C55E" />}
        iconBg="#ECFDF3"
        value={String(info.presentCount)}
        label="Đi học"
        sublabel="Hôm nay"
      />
      <StatBox
        icon={<UserX size={18} color="#F59E0B" />}
        iconBg="#FFF7ED"
        value={String(info.absentCount)}
        label="Vắng học"
        sublabel="Hôm nay"
      />
      <StatBox
        icon={<Icon source="chart-pie" size={18} color="#8B5CF6" />}
        iconBg="#F3E8FF"
        value={`${info.attendanceRate}%`}
        label="Chuyên cần"
        sublabel="Tháng này"
      />
    </View>
  );
}
