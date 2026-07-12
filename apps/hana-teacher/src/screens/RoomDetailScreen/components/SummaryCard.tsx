import { Text, View } from 'react-native';

import { ROOM_STATUS_CONFIG } from '../constants';
import { RoomDetailInfo } from '../types';
import { styles } from '../styles';

interface Props {
  info: RoomDetailInfo;
}

export default function SummaryCard({ info }: Props) {
  const statusConfig = ROOM_STATUS_CONFIG[info.status] ?? ROOM_STATUS_CONFIG.inactive;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryTopRow}>
        <Text style={styles.roomName}>{info.name}</Text>
      </View>
      {!!info.code && <Text style={styles.roomCode}>Mã phòng: {info.code}</Text>}

      <View style={styles.badgeRow}>
        {!!info.typeLabel && (
          <View style={styles.typeBadge}>
            <Text style={styles.typeBadgeText}>{info.typeLabel}</Text>
          </View>
        )}
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <View style={[styles.statusDot, { backgroundColor: statusConfig.dot }]} />
          <Text style={[styles.statusText, { color: statusConfig.color }]}>{statusConfig.label}</Text>
        </View>
      </View>
    </View>
  );
}
