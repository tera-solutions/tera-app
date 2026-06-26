import { View } from 'react-native';
import {
  CalendarCheck2,
  GraduationCap,
  Users,
  ClipboardList,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

import StatsCard from './StatsCard';

import { styles } from './style';

export default function StatsSection() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <StatsCard
        icon={<Users size={24} color="#2196F3" />}
        iconBg="#EAF4FF"
        value="3"
        title="Lớp chủ nhiệm"
        subtitle="Tổng số lớp"
      />

      <StatsCard
        icon={<GraduationCap size={24} color="#22C55E" />}
        iconBg="#ECFDF3"
        value="72"
        title="Học viên"
        subtitle="Tổng số học viên"
        onPress={() => router.push('/student/students')}
      />

      <StatsCard
        icon={<CalendarCheck2 size={24} color="#F59E0B" />}
        iconBg="#FFF7ED"
        value="12"
        title="Buổi học hôm nay"
        subtitle="Lịch dạy"
      />

      <StatsCard
        icon={<ClipboardList size={24} color="#8B5CF6" />}
        iconBg="#F3E8FF"
        value="92%"
        title="Tỷ lệ chuyên cần"
        subtitle="Tháng này"
      />
    </View>
  );
}
