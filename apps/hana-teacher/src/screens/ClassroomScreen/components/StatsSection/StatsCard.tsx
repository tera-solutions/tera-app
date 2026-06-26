import { Text, TouchableOpacity, View } from 'react-native';
import { ReactNode } from 'react';

import { styles } from './style';

interface StatsCardProps {
  icon: ReactNode;
  iconBg: string;
  value: string;
  title: string;
  subtitle: string;
  onPress?: () => void;
}

export default function StatsCard({
  icon,
  iconBg,
  value,
  title,
  subtitle,
  onPress,
}: StatsCardProps) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={onPress ? 0.7 : 1}>
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: iconBg,
          },
        ]}
      >
        {icon}
      </View>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.title}>{title}</Text>

      <Text style={styles.subtitle}>{subtitle}</Text>
    </TouchableOpacity>
  );
}