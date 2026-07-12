import { Text, View } from 'react-native';
import { Icon } from 'react-native-paper';
import moment from 'moment';

import { GENDER_LABELS } from '../constants';
import { ProfileData } from '../types';
import { styles } from '../styles';

interface Row {
  iconName: string;
  label: string;
  value: string;
}

interface Props {
  profile: ProfileData;
}

export default function InfoSection({ profile }: Props) {
  const rows: Row[] = [
    { iconName: 'email-outline', label: 'Email', value: profile.email || 'Chưa cập nhật' },
    {
      iconName: 'cake-variant-outline',
      label: 'Ngày sinh',
      value: profile.dob ? moment(profile.dob).format('DD/MM/YYYY') : 'Chưa cập nhật',
    },
    {
      iconName: 'gender-male-female',
      label: 'Giới tính',
      value: GENDER_LABELS[profile.gender] ?? 'Chưa cập nhật',
    },
    { iconName: 'phone-outline', label: 'Số điện thoại', value: profile.phone || 'Chưa cập nhật' },
  ];

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Thông tin liên hệ</Text>
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
