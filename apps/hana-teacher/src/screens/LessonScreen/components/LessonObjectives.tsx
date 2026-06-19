import React from 'react';
import { View, Text, Image } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

const OBJECTIVES = [
  'Học sinh có thể chào hỏi và giới thiệu bản thân.',
  'Học sinh nhận biết và sử dụng từ vựng cơ bản về tên, tuổi, màu sắc.',
  'Học sinh nghe hiểu và phản hồi các câu hỏi đơn giản.',
  'Học sinh phát triển kỹ năng giao tiếp cơ bản.',
];

export const LessonObjectives = () => (
  <View style={styles.sectionContainer}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionTitleRow}>
        <Icon source="target-account" size={25} color="#007AFF" />
        <Text style={styles.sectionTitle}>Mục tiêu bài học</Text>
      </View>
    </View>
    <View style={styles.objectiveCard}>
      <View style={styles.objectiveList}>
        {OBJECTIVES.map((obj, i) => (
          <View key={i} style={styles.objectiveItem}>
            <Icon source="check-circle" size={22} color="#007AFF" />
            <Text style={styles.objectiveText}>{obj}</Text>
          </View>
        ))}
      </View>
      <Image source={require('@tera/assets/app/element_83.png')} style={styles.objectiveImage} />
    </View>
  </View>
);