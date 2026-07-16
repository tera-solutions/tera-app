import { useNavigate } from "react-router-dom";
import moment from "moment";
import { EyeOutlined, HomeModernOutlined, PencilSquareOutlined, TrashOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import { PATHS } from "_common/components/Layout/Menu/menus";
import RoomStatusBadge from "_common/components/RoomStatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import { useMeta } from "_common/hooks/useMeta";
import { toDate, toTime } from "_common/utils/schedule";

import type { Room } from "../_interface";

interface RoomTableProps {
  rooms: Room[];
  from: number;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onEdit: (room: Room) => void;
  onDelete: (room: Room) => void;
}

const RoomTable = ({ rooms, from, isLoading, isError, onRetry, onEdit, onDelete }: RoomTableProps) => {
  const navigate = useNavigate();
  const { getLabel } = useMeta();

  const columns: TableColumn<Room>[] = [
    {
      key: "code",
      title: "Mã phòng",
      render: (room) => (
        <button
          type="button"
          onClick={() => navigate(`${PATHS.roomDetail}/${room.id}`)}
          className="truncate font-medium text-slate-800 hover:text-brand"
        >
          {room.code || "—"}
        </button>
      ),
    },
    {
      key: "image",
      title: "Ảnh",
      render: (room) => (
        <Avatar
          src={room.image}
          alt={room.name}
          sizeClassName="size-9"
          iconClassName="bg-sky-50 text-brand"
          fallbackIcon={<HomeModernOutlined />}
        />
      ),
    },
    {
      key: "name",
      title: "Tên phòng",
      cellClassName: "px-4 py-3 text-slate-500 truncate",
      render: (room) => room.name || "—",
    },
    {
      key: "type",
      title: "Loại phòng",
      render: (room) => getLabel("room_type", room.type) || "—",
    },
    { key: "floor", title: "Tầng", render: (room) => room.floor || "—" },
    { key: "capacity", title: "Sức chứa", render: (room) => room.capacity || "—" },
    {
      key: "status",
      title: "Trạng thái",
      render: (room) => <RoomStatusBadge room={room} />,
    },
    {
      key: "active_class",
      title: "Lớp học đang sử dụng",
      render: (room) =>
        room.active_class ? (
          <>
            <p className="truncate text-slate-700">{room.active_class.name}</p>
            <p className="text-[11px] text-slate-400">
              {room.active_class.current_students}/{room.active_class.max_capacity} học viên
            </p>
          </>
        ) : (
          "—"
        ),
    },
    {
      key: "next_session",
      title: "Lịch học tiếp theo",
      render: (room) =>
        room.next_session ? (
          <>
            <p>{moment(toDate(room.next_session.date), "YYYY-MM-DD").format("DD/MM/YYYY")}</p>
            <p className="text-[11px] text-slate-400">
              {toTime(room.next_session.start_time)} - {toTime(room.next_session.end_time)}
            </p>
          </>
        ) : (
          "—"
        ),
    },
    {
      key: "actions",
      title: "Thao tác",
      render: (room) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Xem chi tiết"
            onClick={() => navigate(`${PATHS.roomDetail}/${room.id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <EyeOutlined />
          </button>
          <button
            type="button"
            title="Sửa"
            onClick={() => onEdit(room)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <PencilSquareOutlined />
          </button>
          <button
            type="button"
            title="Xóa"
            onClick={() => onDelete(room)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <TrashOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={rooms}
      rowKey={(room) => room.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách phòng học"
      emptyText="Không tìm thấy phòng học phù hợp"
      minWidthClassName="min-w-240"
    />
  );
};

export default RoomTable;
