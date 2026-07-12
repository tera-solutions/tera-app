import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { CourseDetailInfo } from '../types';
import { styles } from '../styles';

interface Row {
  iconName: string;
  label: string;
  value: string;
}

interface Props {
  info: CourseDetailInfo;
}

const formatPrice = (value: number) => `${value.toLocaleString('en-US')}đ`;

export default function InfoSection({ info }: Props) {
  const rows: Row[] = [
    { iconName: 'clock-outline', label: 'Thời lượng', value: `${info.durationMinutes} phút / buổi` },
    { iconName: 'currency-usd', label: 'Học phí', value: `${formatPrice(info.pricePerLesson)} / buổi` },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
      {rows.map((row, index) => (
        <View key={row.label} style={[styles.infoRow, index === 0 && styles.infoRowFirst]}>
          <View style={styles.infoIconWrap}>
            <Icon source={row.iconName} size={16} color="#0066CC" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoLabel}>{row.label}</Text>
            <Text style={styles.infoValue}>{row.value}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}
