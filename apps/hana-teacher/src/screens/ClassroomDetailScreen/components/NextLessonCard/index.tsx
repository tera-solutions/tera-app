import { Image, Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';

import { NextLesson } from '../../types';
import { styles } from '../../styles';

interface Props {
  lesson: NextLesson;
}

export default function NextLessonCard({ lesson }: Props) {
  return (
    <View style={styles.halfCard}>
      <Text style={styles.sectionTitle}>Bài học tiếp theo</Text>

      <View style={styles.nextLessonDateRow}>
        <Icon source="calendar-outline" size={14} color="#94A3B8" />
        <Text style={styles.nextLessonDate}>
          {lesson.dateLabel}, {lesson.time}
        </Text>
      </View>

      <View style={styles.nextLessonBox}>
        <View style={styles.nextLessonInfo}>
          <Text style={styles.nextLessonTitle} numberOfLines={1}>
            {lesson.title}
          </Text>
          <Text style={styles.nextLessonSubtitle} numberOfLines={1}>
            {lesson.subtitle}
          </Text>
        </View>
        <Image
          source={lesson.image}
          style={styles.nextLessonImage}
          resizeMode="cover"
        />
      </View>

      <TouchableOpacity style={styles.nextLessonLink}>
        <Text style={styles.sectionLink}>Xem giáo án</Text>
        <ChevronRight size={14} color="#0066CC" />
      </TouchableOpacity>
    </View>
  );
}
