import { Image } from 'expo-image';
import {
  BookOpen,
  CalendarCheck2,
  ClipboardList,
  Ellipsis,
  FileText,
  MapPin,
  Users,
} from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

import { ClassItem } from '../../types';

import { styles } from './style';

interface Props {
  item: ClassItem;
}

export default function ClassCard({ item }: Props) {
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        {
          borderLeftColor: item.color,
        },
      ]}
    >
      <View style={styles.header}>
        <Image source={item.image} style={styles.avatar} contentFit="cover" />

        <View style={styles.content}>
          <View style={styles.topRow}>
            <View
              style={[
                styles.badge,
                {
                  backgroundColor: `${item.color}15`,
                },
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  {
                    color: item.color,
                  },
                ]}
              >
                {item.name}
              </Text>
            </View>
          </View>

          <Text style={styles.level}>
            {item.ageGroup} • {item.level}
          </Text>

          <View style={styles.locationRow}>
            <MapPin size={14} color="#60A5FA" />

            <Text style={styles.location}>
              {item.room} • {item.branch}
            </Text>
          </View>
        </View>
        <View>
          <View
            style={[
              styles.scheduleCard,
              {
                backgroundColor: `${item.color}10`,
              },
            ]}
          >
            <Text
              style={[
                styles.scheduleTime,
                {
                  color: item.color,
                },
              ]}
            >
              {item.startTime} - {item.endTime}
            </Text>

            <Text style={styles.scheduleText}>{item.schedule}</Text>
          </View>
          <View style={styles.studentRow}>
            <Users size={14} color="#16A34A" />

            <Text style={styles.studentText}>
              {item.students}/{item.totalStudents} học viên
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.buttonMore}>
          <Ellipsis size={20} color="#667085" />
        </TouchableOpacity>
      </View>

      <View style={styles.divider} />

      <View style={styles.actions}>
        <ActionButton
          icon={<Users size={22} color="#2196F3" />}
          label="Danh sách HV"
          onPress={() => router.push(`/student/students?classId=${item.id}`)}
        />

        <ActionButton
          icon={<CalendarCheck2 size={22} color="#22C55E" />}
          label="Điểm danh"
        />

        <ActionButton
          icon={<BookOpen size={22} color="#F97316" />}
          label="Giáo án"
        />

        <ActionButton
          icon={<ClipboardList size={22} color="#8B5CF6" />}
          label="Bài tập"
        />

        <ActionButton
          icon={<FileText size={22} color="#06B6D4" />}
          label="Báo cáo"
          onPress={() => router.push(`/edu/classroom-detail?classId=${item.id}`)}
        />
      </View>
    </View>
  );
}

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
}

function ActionButton({ icon, label, onPress }: ActionButtonProps) {
  return (
    <TouchableOpacity style={styles.actionItem} onPress={onPress}>
      {icon}

      <Text style={styles.actionLabel}>{label}</Text>
    </TouchableOpacity>
  );
}
