import { Image, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Camera, Star } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { StudentDetail } from '../../types';
import { styles } from '../../styles';

interface DetailHeaderProps {
  student: StudentDetail;
}

export default function DetailHeader({ student }: DetailHeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.headerOuter}>
      <Image
        source={require('@tera/assets/app/element_46.png')}
        style={styles.headerBg}
        resizeMode="cover"
      />

      {/* Top nav row */}
      <View style={styles.headerTopRow}>
        <TouchableOpacity style={styles.headerIconBtn} onPress={() => router.back()}>
          <Icon source="chevron-left" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitleCenter}>Chi tiết học viên</Text>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Icon source="dots-horizontal" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Profile info */}
      <View style={styles.headerProfileRow}>
        <View style={styles.avatarWrapper}>
          <Image source={student.avatar} style={styles.avatar} resizeMode="cover" />
          <TouchableOpacity style={styles.cameraBtn}>
            <Camera size={13} color="#0066CC" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <View style={styles.nameRow}>
            <Text style={styles.studentName}>{student.name}</Text>
            {student.isStar && (
              <View style={styles.starBadge}>
                <Star size={10} fill="#FFD700" color="#FFD700" />
                <Text style={styles.starBadgeText}>Star</Text>
              </View>
            )}
          </View>

          <Text style={styles.studentCode}>Mã học viên: {student.studentCode}</Text>

          <View style={styles.profileTagRow}>
            <View style={styles.profileTag}>
              <Icon source="account" size={13} color="rgba(255,255,255,0.85)" />
              <Text style={styles.profileTagText}>
                {student.birthday} ({student.age} tuổi)
              </Text>
            </View>
            <View style={styles.profileTag}>
              <Icon
                source={student.gender === 'Nam' ? 'gender-male' : 'gender-female'}
                size={13}
                color="rgba(255,255,255,0.85)"
              />
              <Text style={styles.profileTagText}>{student.gender}</Text>
            </View>
          </View>

          <View style={styles.classTag}>
            <Icon source="account-group" size={13} color="rgba(255,255,255,0.85)" />
            <Text style={styles.classTagText}>{student.className}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}
