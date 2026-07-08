import type { RoomSortBy, RoomSummary } from "./_interface";

/** Kept in sync with the `room_status` metadata list (see RoomStatus type). */
export const ROOM_STATUS_META = "room_status";

export const SORT_OPTIONS: { value: RoomSortBy; label: string }[] = [
  { value: "name", label: "Tên phòng" },
  { value: "floor", label: "Tầng" },
  { value: "capacity", label: "Sức chứa" },
];

/**
 * Donut segments for the "Thống kê" card. `in_use`/`empty` are a derived split
 * of active rooms by occupancy (see `RoomStatusBadge`), not `room_status` enum
 * values themselves, so they're defined directly rather than via meta lookup.
 */
export const ROOM_SUMMARY_SEGMENTS: {
  key: string;
  label: string;
  color: string;
  value: (summary: RoomSummary) => number;
}[] = [
  { key: "in_use", label: "Đang sử dụng", color: "#10b981", value: (s) => s.in_use },
  { key: "empty", label: "Phòng trống", color: "#0ea5e9", value: (s) => s.empty },
  { key: "maintenance", label: "Bảo trì", color: "#f59e0b", value: (s) => s.maintenance },
];
