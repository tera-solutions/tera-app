import React from 'react';
import { View, Text } from 'react-native';
import { Icon } from 'react-native-paper';
import { styles } from '../styles';

interface CategoryProps {
  title: string;
  count: number;
  icon: string;
  color: string;
  bgColor: string;
}

export default function AchievementCategoryCard({
  title,
  count,
  icon,
  color,
  bgColor,
}: CategoryProps) {
  return (
    <View style={styles.achievementCard}>
      <View style={[styles.achievementBadge, { backgroundColor: bgColor }]}>
        <Icon source={icon} size={36} color={color} />
      </View>
      <Text style={styles.achievementTitle} numberOfLines={1}>
        {title}
      </Text>
      <Text style={styles.achievementStudents}>{count} học viên</Text>
    </View>
  );
}
