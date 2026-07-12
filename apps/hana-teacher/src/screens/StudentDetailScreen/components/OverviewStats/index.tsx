import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { OverviewStat } from '../../types';
import { styles } from '../../styles';

interface OverviewStatsProps {
  stats: OverviewStat[];
}

function StatBox({ stat }: { stat: OverviewStat }) {
  return (
    <View style={styles.overviewStatBox}>
      <View style={[styles.overviewStatIcon, { backgroundColor: stat.iconBg }]}>
        <Icon source={stat.iconName} size={22} color={stat.iconColor} />
      </View>
      <Text style={[styles.overviewStatValue, { color: stat.iconColor }]}>
        {stat.value}
      </Text>
      <Text style={styles.overviewStatLabel}>{stat.label}</Text>
      {!!stat.sublabel && (
        <Text style={styles.overviewStatSublabel}>{stat.sublabel}</Text>
      )}
    </View>
  );
}

export default function OverviewStats({ stats }: OverviewStatsProps) {
  return (
    <View style={styles.sectionCard}>
      <View style={styles.sectionTitleRow}>
        <View style={styles.sectionTitleLeft}>
          <Icon source="text-box-outline" size={20} color="#0066CC" />
          <Text style={styles.sectionTitle}>Tổng quan học tập</Text>
        </View>
      </View>

      <View style={styles.overviewGrid}>
        {stats.map((stat, idx) => (
          <StatBox key={idx} stat={stat} />
        ))}
      </View>
    </View>
  );
}
