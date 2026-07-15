export type RoomType =
  | "classroom"
  | "computer_room"
  | "speaking_room"
  | "exam_room"
  | "meeting_room"
  | "other";

export type RoomStatus = "active" | "inactive" | "maintenance";

export interface IRoom {
  id?: number;
  room_code?: string;
  room_name?: string;
  avatar?: string | null;
  floor?: string | null;
  capacity?: number | null;
  room_type?: RoomType;
  status?: RoomStatus;
  description?: string | null;
  branch_id?: number;
  branch?: { id?: number; name?: string; code?: string } | null;
  active_classes_count?: number;
  created_by?: number | null;
  updated_by?: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface IRoomForm {
  branch_id: string;
  room_code: string;
  room_name: string;
  avatar?: string;
  floor?: string;
  capacity?: number | string;
  room_type: string;
  description?: string;
}

/** room_type KHÔNG có trong metadata → label từ i18n `room.type_*` */
export const ROOM_TYPES: RoomType[] = [
  "classroom",
  "computer_room",
  "speaking_room",
  "exam_room",
  "meeting_room",
  "other",
];
