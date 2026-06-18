import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Users } from 'lucide-react-native';

import { styles } from './style';

export interface ClassOverview {
  totalClass: number;
  classes: string[];
}

interface Props {
  data?: ClassOverview;
  onPressViewAll?: () => void;
}

export default function ClassOverviewCard({
  data = {
    totalClass: 3,
    classes: ['Starters 2A', 'Movers 1B', 'Flyers 3A'],
  },
  onPressViewAll,
}: Props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Users
            size={18}
            color="#2196F3"
          />

          <Text style={styles.title}>
            Lớp chủ nhiệm
          </Text>
        </View>
      </View>

      <View style={styles.content}>
        <View>
          <Text style={styles.totalValue}>
            {data.totalClass}
          </Text>

          <Text style={styles.totalLabel}>
            lớp
          </Text>
        </View>

        <Image
          source={require('@tera/assets/app/element_63.png')}
          resizeMode="contain"
          style={styles.image}
        />
      </View>

      <View style={styles.classList}>
        {data.classes.map((item) => (
          <View
            key={item}
            style={styles.classChip}
          >
            <Text style={styles.classChipText}>
              {item}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}