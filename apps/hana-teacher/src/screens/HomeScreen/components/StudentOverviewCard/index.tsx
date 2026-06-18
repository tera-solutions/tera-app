import { Image, Text, View } from 'react-native';
import { Users } from 'lucide-react-native';

import { styles } from './style';

export interface StudentOverview {
  totalStudent: number;
  growthPercent: number;
}

interface Props {
  data?: StudentOverview;
}

export default function StudentOverviewCard({
  data = {
    totalStudent: 72,
    growthPercent: 8,
  },
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Users
            size={18}
            color="#16A34A"
          />

          <Text style={styles.title}>
            Học viên
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.totalValue}>
            {data.totalStudent}
          </Text>

          <Text style={styles.totalLabel}>
            học viên
          </Text>
        </View>

        <Image
          source={require('@tera/assets/app/element_64.png')}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.growthContainer}>
        <Text style={styles.growthValue}>
          ↑ {data.growthPercent}%
        </Text>

        <Text style={styles.growthLabel}>
          so với tháng trước
        </Text>
      </View>
    </View>
  );
}