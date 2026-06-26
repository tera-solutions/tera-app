import { Text, TouchableOpacity, View } from 'react-native';
import { Ellipsis } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import { useRouter } from 'expo-router';

import { ExamItem as ExamItemType, ExamStatus } from '../../types';
import { styles } from '../../styles';

interface Props {
  item: ExamItemType;
}

const STATUS_CONFIG: Record<
  ExamStatus,
  { label: string; bg: string; color: string }
> = {
  ongoing: { label: 'Đang diễn ra', bg: '#F0FDF4', color: '#16A34A' },
  needs_grading: { label: 'Cần chấm bài', bg: '#FFF7ED', color: '#EA580C' },
  completed: { label: 'Đã hoàn thành', bg: '#F0FDF4', color: '#16A34A' },
  upcoming: { label: 'Chưa bắt đầu', bg: '#F1F5F9', color: '#64748B' },
};

export default function ExamItem({ item }: Props) {
  const router = useRouter();
  const statusCfg = STATUS_CONFIG[item.status];

  return (
    <View style={styles.examItem}>
      <View style={styles.examItemTop}>
        {/* Icon */}
        <View style={[styles.examIcon, { backgroundColor: item.iconBg }]}>
          <Icon source={item.iconName} size={26} color={item.iconColor} />
        </View>

        {/* Body */}
        <View style={styles.examBody}>
          <View style={styles.examTitleRow}>
            <Text style={styles.examTitle} numberOfLines={2}>
              {item.title}
            </Text>
            <View style={styles.examStatusRow}>
              <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
                <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
                  {statusCfg.label}
                </Text>
              </View>
              {item.status === 'needs_grading' && item.needsGradingCount != null && (
                <View style={styles.gradingCountBadge}>
                  <Text style={styles.gradingCountText}>{item.needsGradingCount}</Text>
                </View>
              )}
              <TouchableOpacity style={styles.examMenuBtn}>
                <Ellipsis size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.examClassName}>{item.className}</Text>

          <View style={styles.examMetaRow}>
            <Icon source="calendar-outline" size={14} color="#94A3B8" />
            <Text style={styles.examMetaText}>
              Thời gian: {item.date} • {item.duration} phút
            </Text>
          </View>

          <View style={styles.examMetaRow}>
            <Icon source="account-group-outline" size={14} color="#94A3B8" />
            <Text style={styles.examMetaText}>Số học viên: {item.studentCount}</Text>
          </View>
        </View>
      </View>

      <View style={styles.examItemBottom}>
        <TouchableOpacity
          style={styles.detailBtn}
          onPress={() => router.push(`/edu/exam-detail?examId=${item.id}` as any)}
        >
          <Text style={styles.detailBtnText}>Xem chi tiết</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
