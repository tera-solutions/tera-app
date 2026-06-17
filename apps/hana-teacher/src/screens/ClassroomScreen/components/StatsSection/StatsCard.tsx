import { Text, View } from 'react-native';
import { ReactNode } from 'react';

import { styles } from './style';

interface StatsCardProps {
  icon: ReactNode;
  iconBg: string;
  value: string;
  title: string;
  subtitle: string;
}

export default function StatsCard({
  icon,
  iconBg,
  value,
  title,
  subtitle,
}: StatsCardProps) {
  return (
    <View style={styles.card}>
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
    </View>
  );
}