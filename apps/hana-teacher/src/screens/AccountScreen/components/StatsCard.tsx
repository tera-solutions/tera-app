import { Text, View } from 'react-native';

import { styles } from '../style';

export default function StatsCard({ data }: any) {
  return (
    <View style={styles.statsCard}>
      {data.map((item: any, index: number) => {
        const Icon = item.icon;

        return (
          <View
            key={item.label}
            style={[
              styles.statItem,
              index !== data.length - 1 && styles.statBorder,
            ]}
          >
            <Icon color="#0066cc" size={28} />

            <Text style={styles.statValue}>
              {item.value}
            </Text>

            <Text style={styles.statLabel}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}