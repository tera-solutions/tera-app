import { Text, View } from 'react-native';

import { RoomDetailInfo } from '../types';
import { styles } from '../styles';

interface Props {
  info: RoomDetailInfo;
}

export default function DescriptionSection({ info }: Props) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Mô tả / Thiết bị</Text>
      {info.description ? (
        <Text style={styles.descriptionText}>{info.description}</Text>
      ) : (
        <Text style={styles.emptyText}>Chưa có mô tả</Text>
      )}
    </View>
  );
}
