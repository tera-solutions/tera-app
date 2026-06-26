import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';

import { ChildInfo } from '../../types';
import { styles } from '../../styles';

interface Props {
  child: ChildInfo;
}

export default function ChildSection({ child }: Props) {
  const router = useRouter();
  return (
    <View style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>Con em đang theo học</Text>

      <View style={styles.childCard}>
        <Image source={child.avatar} style={styles.childAvatar} resizeMode="contain" />

        <View style={styles.childInfo}>
          <View style={styles.childNameRow}>
            <Text style={styles.childName}>{child.name}</Text>
            <View style={styles.childClassTag}>
              <Text style={styles.childClassTagText}>{child.className}</Text>
            </View>
          </View>
          <Text style={styles.childMeta}>Trình độ: {child.level}</Text>
          <Text style={styles.childMeta}>
            Thời gian học: {child.startDate} - {child.endDate}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.childDetailBtn}
          onPress={() => router.push('/student/student-detail?studentId=st1' as any)}
        >
          <Text style={styles.childDetailBtnText}>Xem chi tiết</Text>
          <ChevronRight size={13} color="#475569" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
