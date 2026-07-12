import { ROOM_TYPE_LABELS } from './constants';
import { RoomDetailInfo, RoomResponse } from './types';

export function toRoomDetailInfo(room?: RoomResponse | null): RoomDetailInfo | null {
  if (!room) return null;

  return {
    id: room.id,
    name: room.room_name,
    code: room.room_code ?? '',
    floor: room.floor ?? '',
    capacity: room.capacity ?? 0,
    typeLabel: ROOM_TYPE_LABELS[room.room_type ?? ''] ?? '',
    status: room.status ?? 'inactive',
    description: room.description ?? '',
    branchName: room.branch?.name ?? '',
    activeClassesCount: room.active_classes_count ?? 0,
  };
}
