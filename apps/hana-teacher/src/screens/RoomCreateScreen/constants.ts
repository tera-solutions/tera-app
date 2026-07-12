import { RoomFormValues } from './types';

export const ROOM_TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'classroom', label: 'Phòng học' },
  { value: 'computer_room', label: 'Phòng máy tính' },
  { value: 'speaking_room', label: 'Phòng luyện nói' },
  { value: 'exam_room', label: 'Phòng thi' },
  { value: 'meeting_room', label: 'Phòng họp' },
  { value: 'other', label: 'Khác' },
];

export const ROOM_STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'active', label: 'Hoạt động' },
  { value: 'inactive', label: 'Ngưng hoạt động' },
  { value: 'maintenance', label: 'Bảo trì' },
];

export const DEFAULT_FORM_VALUES: RoomFormValues = {
  room_name: '',
  room_code: '',
  room_type: 'classroom',
  floor: '',
  capacity: '',
  description: '',
  status: 'active',
};
