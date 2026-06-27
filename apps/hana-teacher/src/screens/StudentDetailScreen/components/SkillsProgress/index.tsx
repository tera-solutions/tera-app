import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Icon } from 'react-native-paper';
import Svg, { Circle } from 'react-native-svg';

import { SkillItem } from '../../types';
import { styles } from '../../styles';

interface SkillCircleProps {
  skill: SkillItem;
}

const RADIUS = 30;
const STROKE = 6;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function SkillCircle({ skill }: SkillCircleProps) {
  const strokeDashoffset = CIRCUMFERENCE * (1 - skill.percent / 100);

  return (
    <View style={styles.skillItem}>
      <View style={{ width: 72, height: 72, alignItems: 'center', justifyContent: 'center' }}>
        <Svg width={72} height={72} viewBox="0 0 72 72">
          {/* Track */}
          <Circle
            cx={36}
            cy={36}
            r={RADIUS}
            stroke="#E2E8F0"
            strokeWidth={STROKE}
            fill="none"
          />
          {/* Progress */}
          <Circle
            cx={36}
            cy={36}
            r={RADIUS}
            stroke={skill.color}
            strokeWidth={STROKE}
            fill="none"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin="36, 36"
          />
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
          <Text style={[styles.skillPercent, { color: skill.color }]}>
            {skill.percent}%
          </Text>
        </View>
      </View>
      <Text style={styles.skillLabel}>{skill.label}</Text>
    </View>
  );
}

interface SkillsProgressProps {
  skills: SkillItem[];
  onViewDetail?: () => void;
}

export default function SkillsProgress({ skills, onViewDetail }: SkillsProgressProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="chart-bar" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Năng lực theo kỹ năng</Text>
        </View>
      </View>

      <View style={styles.skillsRow}>
        {skills.map((skill) => (
          <SkillCircle key={skill.label} skill={skill} />
        ))}
      </View>

      <TouchableOpacity style={styles.viewAllBtn} onPress={onViewDetail}>
        <Text style={styles.viewAllText}>Xem chi tiết kết quả</Text>
        <ChevronRight size={14} color="#0066CC" />
      </TouchableOpacity>
    </View>
  );
}
