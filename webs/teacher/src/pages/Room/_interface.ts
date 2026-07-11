export type RoomStatus = "active" | "inactive" | "maintenance";

export type RoomSortBy = "name" | "floor" | "capacity";
export type RoomSortDir = "asc" | "desc";

export interface RoomSession {
  date: string;
  start_time: string;
  end_time: string;
}

export interface RoomActiveClass {
  id: number;
  name: string;
  current_students: number;
  max_capacity: number;
}

export interface Room {
  id: number;
  code: string;
  name: string;
  image: string;
  type: string;
  floor: string;
  capacity: number;
  status: RoomStatus;
  active_classes_count: number;
  active_class: RoomActiveClass | null;
  next_session: RoomSession | null;
}

export interface RoomSummary {
  total: number;
  in_use: number;
  maintenance: number;
  empty: number;
  total_students: number;
  online_rooms: number;
}

export interface RoomFilters {
  search: string;
  status: RoomStatus | "";
  type: string;
  floor: string;
}
