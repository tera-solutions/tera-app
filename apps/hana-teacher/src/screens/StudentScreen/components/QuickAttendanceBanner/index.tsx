import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ClipboardCheck } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { styles } from '../../styles';

interface QuickAttendanceBannerProps {
  classId?: string;
}

export default function QuickAttendanceBanner({ classId }: QuickAttendanceBannerProps) {
  const router = useRouter();

  const handleAttendance = () => {
    router.push(`/student/attendance${classId ? `?classId=${classId}` : ''}`);
  };

  return (
    <View style={styles.attendanceBanner}>
      <View style={styles.attendanceBannerBody}>
        <Text style={styles.attendanceBannerTitle}>Điểm danh lớp nhanh chóng</Text>
        <Text style={styles.attendanceBannerSubtitle}>
          Thực hiện điểm danh và theo dõi{'\n'}tình trạng học tập của học viên
        </Text>
        <TouchableOpacity style={styles.attendanceBannerBtn} onPress={handleAttendance}>
          <ClipboardCheck size={15} color="#FFFFFF" />
          <Text style={styles.attendanceBannerBtnText}>Điểm danh</Text>
        </TouchableOpacity>
      </View>

      <Image
        source={require('@tera/assets/app/element_91.png')}
        style={styles.attendanceBannerIllustration}
        resizeMode="contain"
      />
    </View>
  );
}
