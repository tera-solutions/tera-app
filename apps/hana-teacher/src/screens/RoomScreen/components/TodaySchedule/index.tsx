import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Play, FileText } from 'lucide-react-native';

import { ScheduleItem } from '../../types';
import { styles } from '../../styles';

interface Props {
  schedules: ScheduleItem[];
  onViewAll?: () => void;
  onStartClass?: (item: ScheduleItem) => void;
  onViewLesson?: (item: ScheduleItem) => void;
}

export default function TodaySchedule({
  schedules,
  onViewAll,
  onStartClass,
  onViewLesson,
}: Props) {
  const item = schedules[0];
  if (!item) return null;

  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Lịch học hôm nay</Text>
        <TouchableOpacity style={styles.sectionLink} onPress={onViewAll}>
          <Text style={styles.sectionLinkText}>Xem tất cả</Text>
          <ChevronRight size={14} color="#0066CC" />
        </TouchableOpacity>
      </View>

      <View style={styles.scheduleCard}>
        {/* Time */}
        <View style={styles.scheduleTime}>
          <Text style={styles.scheduleTimeText}>{item.startTime}</Text>
          <Text style={styles.scheduleTimeDash}>-</Text>
          <Text style={styles.scheduleTimeText}>{item.endTime}</Text>
        </View>

        {/* Lesson image */}
        <Image source={item.image} style={styles.scheduleLessonImage} resizeMode="cover" />

        {/* Info */}
        <View style={styles.scheduleLesson}>
          <Text style={styles.scheduleLessonTitle} numberOfLines={1}>
            {item.lessonTitle}
          </Text>
          <Text style={styles.scheduleLessonSubtitle} numberOfLines={1}>
            {item.lessonSubtitle}
          </Text>
        </View>

        {/* Actions */}
        <View style={styles.scheduleActions}>
          <TouchableOpacity style={styles.startClassBtn} onPress={() => onStartClass?.(item)}>
            <Play size={12} color="#FFFFFF" fill="#FFFFFF" />
            <Text style={styles.startClassBtnText}>Bắt đầu lớp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.lessonPlanBtn} onPress={() => onViewLesson?.(item)}>
            <FileText size={12} color="#475569" />
            <Text style={styles.lessonPlanBtnText}>Xem giáo án</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Pagination dots */}
      <View style={styles.paginationDots}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
      </View>
    </View>
  );
}
