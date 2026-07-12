import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';

import { RoomDetailInfo } from '../types';
import { styles } from '../styles';

interface Row {
  iconName: string;
  label: string;
  value: string;
}

interface Props {
  info: RoomDetailInfo;
}

export default function InfoSection({ info }: Props) {
  const rows: Row[] = [
    { iconName: 'floor-plan', label: 'Tầng', value: info.floor || 'Chưa cập nhật' },
    { iconName: 'account-group-outline', label: 'Sức chứa', value: `${info.capacity} học viên` },
    { iconName: 'office-building-outline', label: 'Chi nhánh', value: info.branchName || 'Chưa cập nhật' },
    { iconName: 'google-classroom', label: 'Lớp đang hoạt động', value: `${info.activeClassesCount} lớp` },
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
