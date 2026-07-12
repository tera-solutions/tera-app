export type RoomApiStatus = 'active' | 'inactive' | 'maintenance';

export type RoomType =
  | 'classroom'
  | 'computer_room'
  | 'speaking_room'
  | 'exam_room'
  | 'meeting_room'
  | 'other';

export interface RoomBranch {
  id: number;
  name: string;
  code?: string;
}

export interface RoomResponse {
  id: number;
  room_code?: string;
  room_name: string;
  floor?: string | null;
  capacity?: number | null;
  room_type?: RoomType;
  status?: RoomApiStatus;
  description?: string | null;
  branch_id?: number;
  branch?: RoomBranch | null;
  active_classes_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface RoomDetailInfo {
  id: number;
  name: string;
  code: string;
  floor: string;
  capacity: number;
  typeLabel: string;
  status: RoomApiStatus;
  description: string;
  branchName: string;
  activeClassesCount: number;
}
