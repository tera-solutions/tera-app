import Badge from "_common/components/Badge";
import StatusBadge from "_common/components/StatusBadge";
import { isRoomOccupied } from "_common/utils/room";

interface RoomStatusBadgeProps {
  room: { status: string; active_classes_count: number };
  className?: string;
}

/**
 * Room status display: the real `room_status` metadata badge for
 * inactive/maintenance, or a derived "in use / empty" split for active rooms
 * (not itself a `room_status` value — see `isRoomOccupied`).
 */
const RoomStatusBadge = ({ room, className }: RoomStatusBadgeProps) => {
  if (room.status !== "active") {
    return <StatusBadge name="room_status" value={room.status} className={className} />;
  }

  const occupied = isRoomOccupied(room);
  const meta = occupied
    ? { label: "Đang sử dụng", color: "#059669", backgroundColor: "#ecfdf5" }
    : { label: "Phòng trống", color: "#0284c7", backgroundColor: "#f0f9ff" };

  return (
    <Badge
      className={className ?? "px-2.5 py-0.5 text-[11px]"}
      style={{ color: meta.color, backgroundColor: meta.backgroundColor }}
    >
      {meta.label}
    </Badge>
  );
};

export default RoomStatusBadge;
