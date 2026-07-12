import { useState } from 'react';
import { ActivityIndicator, FlatList, View } from 'react-native';
import { useRouter } from 'expo-router';

import { useRoomList } from '@tera/modules/education/room';
import { getListData } from '@tera/commons/hooks';

import RoomHeader from './components/RoomHeader';
import RoomInfoCard from './components/RoomInfoCard';

import { RoomInfo, RoomResponse, RoomApiStatus } from './types';
import { styles } from './styles';

const ROOM_IMAGE = require('@tera/assets/app/element_105.png');

const ROOM_TYPE_LABELS: Record<string, string> = {
  classroom: 'Phòng học',
  computer_room: 'Phòng máy tính',
  speaking_room: 'Phòng luyện nói',
  exam_room: 'Phòng thi',
  meeting_room: 'Phòng họp',
  other: 'Khác',
};

const STATUS_MAP: Record<RoomApiStatus, RoomInfo['status']> = {
  active: 'active',
  inactive: 'inactive',
  maintenance: 'inactive',
};

function mapToRoomInfo(room: RoomResponse): RoomInfo {
  const branchName = room.branch?.name ?? '';
  const roomLabel = ROOM_TYPE_LABELS[room.room_type ?? ''] ?? '';

  return {
    id: String(room.id),
    name: branchName ? `${room.room_name} - ${branchName}` : room.room_name,
    className: roomLabel,
    capacity: room.capacity ?? 0,
    equipment: room.description ?? '',
    status: STATUS_MAP[room.status ?? 'inactive'] ?? 'inactive',
    image: ROOM_IMAGE,
    totalStudents: room.active_classes_count ?? 0,
    attendanceDisplay: String(room.active_classes_count ?? 0),
    lessonCount: 0,
    scheduleCount: 0,
  };
}

export default function RoomScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const { data, isLoading, isFetching, refetch } = useRoomList({
    params: { search: search || undefined, per_page: 50 },
  });

  const { items } = getListData<RoomResponse>(data);
  const rooms = items.map(mapToRoomInfo);

  return (
    <View style={styles.container}>
      <RoomHeader />

      {isLoading ? (
        <ActivityIndicator size="large" color="#0B84FF" style={{ marginTop: 48 }} />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(_, i) => String(i)}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshing={isFetching}
          onRefresh={refetch}
          renderItem={({ item }) => (
            <RoomInfoCard
              info={item}
              onPress={() => router.push(`/edu/room-detail?roomId=${item.id}` as any)}
              onEdit={() => router.push(`/edu/room-create?roomId=${item.id}` as any)}
            />
          )}
        />
      )}
    </View>
  );
}
