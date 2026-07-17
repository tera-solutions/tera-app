import {
  EyeOutlined,
  PaperAirplaneOutlined,
  PencilSquareOutlined,
  PhoneOutlined,
  TrashOutlined,
} from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";

import type { ParentRow } from "../_interface";
import { RELATION_BADGE, RELATION_BADGE_DEFAULT } from "../constants";

interface ParentTableProps {
  items: ParentRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (parent: ParentRow) => void;
  onMessage: (parent: ParentRow) => void;
  onEdit: (parent: ParentRow) => void;
  onDelete: (parent: ParentRow) => void;
}

const ParentTable = ({
  items,
  loading,
  isError,
  onRetry,
  onView,
  onMessage,
  onEdit,
  onDelete,
}: ParentTableProps) => {
  const columns: TableColumn<ParentRow>[] = [
    {
      key: "name",
      title: "Họ tên",
      render: (parent) => (
        <button
          type="button"
          onClick={() => onView(parent)}
          className="flex items-center gap-2.5 text-left"
        >
          <Avatar src={parent.avatar} alt={parent.name} sizeClassName="size-9" />
          <span className="font-medium text-slate-800 hover:text-brand">{parent.name || "—"}</span>
        </button>
      ),
    },
    {
      key: "relation",
      title: "Liên hệ",
      render: (parent) => (
        <Badge className={`px-2.5 py-0.5 text-[11px] ${RELATION_BADGE[parent.relation] ?? RELATION_BADGE_DEFAULT}`}>
          {parent.relation || "Phụ huynh"}
        </Badge>
      ),
    },
    {
      key: "children",
      title: "Lớp của con",
      render: (parent) => {
        const first = parent.children[0];
        const extra = parent.children.length - 1;
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-slate-700">{first?.name || "—"}</span>
            <span className="text-xs text-slate-400">
              {first?.class_name || "—"}
              {extra > 0 ? ` +${extra}` : ""}
            </span>
          </div>
        );
      },
    },
    { key: "phone", title: "Số điện thoại", render: (parent) => parent.phone || "—" },
    { key: "email", title: "Email", render: (parent) => parent.email || "—" },
    {
      key: "actions",
      title: "Thao tác",
      render: (parent) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Xem"
            onClick={() => onView(parent)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <EyeOutlined />
          </button>
          <button
            type="button"
            title="Nhắn tin"
            onClick={() => onMessage(parent)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <PaperAirplaneOutlined />
          </button>
          {parent.phone && (
            <a
              href={`tel:${parent.phone}`}
              title="Gọi"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
            >
              <PhoneOutlined />
            </a>
          )}
          <button
            type="button"
            title="Sửa"
            onClick={() => onEdit(parent)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <PencilSquareOutlined />
          </button>
          <button
            type="button"
            title="Xóa"
            onClick={() => onDelete(parent)}
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
      data={items}
      rowKey={(parent) => parent.id}
      isLoading={loading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách phụ huynh"
      emptyText="Không có phụ huynh phù hợp"
      minWidthClassName="min-w-215"
    />
  );
};

export default ParentTable;
