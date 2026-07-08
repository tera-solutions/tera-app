/**
 * Whether an active room currently has a class in progress — not itself a
 * `room_status` enum value (that's active/inactive/maintenance, from the
 * `room_status` metadata list), just the "in use vs empty" split the room
 * screens draw within the active state.
 */
export const isRoomOccupied = (room: { status: string; active_classes_count: number }): boolean =>
  room.status === "active" && room.active_classes_count > 0;
