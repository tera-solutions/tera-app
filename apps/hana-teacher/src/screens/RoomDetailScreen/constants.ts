export const ROOM_TYPE_LABELS: Record<string, string> = {
  classroom: 'Phòng học',
  computer_room: 'Phòng máy tính',
  speaking_room: 'Phòng luyện nói',
  exam_room: 'Phòng thi',
  meeting_room: 'Phòng họp',
  other: 'Khác',
};

export const ROOM_STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; dot: string }
> = {
  active: { label: 'Đang hoạt động', color: '#16A34A', bg: '#F0FDF4', dot: '#22C55E' },
  inactive: { label: 'Ngưng hoạt động', color: '#64748B', bg: '#F1F5F9', dot: '#94A3B8' },
  maintenance: { label: 'Bảo trì', color: '#D97706', bg: '#FFF7E6', dot: '#F59E0B' },
};
