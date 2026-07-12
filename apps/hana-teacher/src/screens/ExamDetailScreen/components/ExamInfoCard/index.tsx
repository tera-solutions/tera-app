import { Text, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { ExamDetailInfo } from '../../types';
import { STATUS_CONFIG } from '../../constants';
import { styles } from '../../styles';

interface Props {
  exam: ExamDetailInfo;
  onGrade?: () => void;
}

export default function ExamInfoCard({ exam, onGrade }: Props) {
  const statusCfg = STATUS_CONFIG[exam.status];

  return (
    <View style={styles.infoCard}>
      <View style={styles.infoCardTop}>
        {/* Icon */}
        <View style={[styles.examIconBox, { backgroundColor: exam.iconBg }]}>
          <Icon source={exam.iconName} size={26} color={exam.iconColor} />
        </View>

        {/* Title + class + status */}
        <View style={styles.infoCardBody}>
          <Text style={styles.examTitle}>{exam.title}</Text>
          <Text style={styles.examClassName}>{exam.className}</Text>
          <View style={[styles.statusBadge, { backgroundColor: statusCfg.bg }]}>
            <Text style={[styles.statusBadgeText, { color: statusCfg.color }]}>
              {statusCfg.label}
            </Text>
          </View>
        </View>

        {/* Grade button */}
        <TouchableOpacity style={styles.gradingBtn} onPress={onGrade}>
          <Icon source="pencil-outline" size={14} color="#0066CC" />
          <Text style={styles.gradingBtnText}>Chấm bài</Text>
        </TouchableOpacity>
      </View>

      {/* Meta row */}
      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Icon source="door-open" size={16} color="#94A3B8" />
          <Text style={styles.metaLabel}>Phòng thi</Text>
          <Text style={styles.metaValue}>{exam.roomName || '—'}</Text>
        </View>
        <View style={[styles.metaItem, styles.metaItemBorder]}>
          <Icon source="clock-outline" size={16} color="#94A3B8" />
          <Text style={styles.metaLabel}>Thời gian làm bài</Text>
          <Text style={styles.metaValue}>{exam.duration} phút</Text>
        </View>
        <View style={[styles.metaItem, styles.metaItemBorder]}>
          <Icon source="calendar-outline" size={16} color="#94A3B8" />
          <Text style={styles.metaLabel}>Ngày kiểm tra</Text>
          <Text style={styles.metaValue}>{exam.examDate}</Text>
        </View>
        <View style={[styles.metaItem, styles.metaItemBorder]}>
          <Icon source="account-tie-outline" size={16} color="#94A3B8" />
          <Text style={styles.metaLabel}>Giáo viên</Text>
          <Text style={styles.metaValue}>{exam.teacherName || '—'}</Text>
        </View>
      </View>
    </View>
  );
}
