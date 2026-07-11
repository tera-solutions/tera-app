import type { Room, RoomSummary } from "./_interface";

export const toRoom = (raw: any): Room => ({
  id: raw?.id ?? 0,
  code: raw?.room_code ?? "",
  name: raw?.room_name ?? "",
  image: raw?.image ?? "",
  type: raw?.room_type ?? "",
  floor: raw?.floor ?? "",
  capacity: raw?.capacity ?? 0,
  status: (raw?.status ?? "active") as Room["status"],
  active_classes_count: raw?.active_classes_count ?? 0,
  active_class: raw?.active_class
    ? {
        id: raw.active_class.id,
        name: raw.active_class.name ?? "",
        current_students: raw.active_class.current_students ?? 0,
        max_capacity: raw.active_class.max_capacity ?? 0,
      }
    : null,
  next_session: raw?.next_session
    ? {
        date: raw.next_session.date,
        start_time: raw.next_session.start_time,
        end_time: raw.next_session.end_time,
      }
    : null,
});

export const toRooms = (raw: any[] | null | undefined): Room[] => (raw ?? []).map(toRoom);

export const toRoomSummary = (raw: any): RoomSummary => ({
  total: raw?.total ?? 0,
  in_use: raw?.in_use ?? 0,
  maintenance: raw?.maintenance ?? 0,
  empty: raw?.empty ?? 0,
  total_students: raw?.total_students ?? 0,
  online_rooms: raw?.online_rooms ?? 0,
});
