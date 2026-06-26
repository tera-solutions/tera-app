import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { LearningStat } from '../../types';
import { styles } from '../../styles';

interface Props {
  studentName: string;
  stats: LearningStat[];
}

export default function LearningOverview({ studentName, stats }: Props) {
  return (
    <View style={styles.sectionCard}>
      <Text style={[styles.sectionTitle, { marginBottom: 12 }]}>
        Tổng quan học tập của {studentName}
      </Text>

      <View style={styles.learningGrid}>
        {stats.map((s) => (
          <View key={s.label} style={[styles.learningStat, { backgroundColor: s.bg }]}>
            <Icon source={s.iconName} size={24} color={s.iconColor} />
            <Text style={[styles.learningStatValue, { color: s.iconColor }]}>
              {s.value}
            </Text>
            <Text style={styles.learningStatLabel}>{s.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
