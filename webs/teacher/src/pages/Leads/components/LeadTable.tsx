import moment from "moment";
import { EyeOutlined, PencilSquareOutlined, PhoneOutlined, TrashOutlined } from "tera-dls";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";

import type { LeadRow } from "../_interface";
import { SOURCE_LABEL } from "../constants";

interface LeadTableProps {
  items: LeadRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onView: (lead: LeadRow) => void;
  onEdit: (lead: LeadRow) => void;
  onDelete: (lead: LeadRow) => void;
}

const fmtDate = (value: string) => (value ? moment(value).format("DD/MM/YYYY") : "—");

const LeadTable = ({ items, loading, isError, onRetry, onView, onEdit, onDelete }: LeadTableProps) => {
  const columns: TableColumn<LeadRow>[] = [
    {
      key: "name",
      title: "Họ tên",
      render: (lead) => (
        <button type="button" onClick={() => onView(lead)} className="text-left">
          <span className="font-medium text-slate-800 hover:text-brand">{lead.name || "—"}</span>
          <span className="block text-xs text-slate-400">{lead.code}</span>
        </button>
      ),
    },
    { key: "phone", title: "SĐT", render: (lead) => lead.phone || "—" },
    {
      key: "source",
      title: "Nguồn",
      render: (lead) => SOURCE_LABEL[lead.source] ?? lead.source ?? "—",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (lead) => <StatusBadge name="lead_status" value={lead.status} />,
    },
    { key: "owner", title: "Người phụ trách", render: (lead) => lead.owner_name || "—" },
    { key: "created_at", title: "Ngày tạo", cellClassName: "px-4 py-3 text-slate-500", render: (lead) => fmtDate(lead.created_at) },
    {
      key: "actions",
      title: "Thao tác",
      render: (lead) => (
        <div className="flex items-center gap-1">
          <button
            type="button"
            title="Xem"
            onClick={() => onView(lead)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <EyeOutlined />
          </button>
          {lead.phone && (
            <a
              href={`tel:${lead.phone}`}
              title="Gọi"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
            >
              <PhoneOutlined />
            </a>
          )}
          <button
            type="button"
            title="Sửa"
            onClick={() => onEdit(lead)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4.5 [&_svg]:w-4.5"
          >
            <PencilSquareOutlined />
          </button>
          <button
            type="button"
            title="Ngừng theo dõi"
            onClick={() => onDelete(lead)}
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
      rowKey={(lead) => lead.id}
      isLoading={loading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách lead"
      emptyText="Không có lead phù hợp"
      minWidthClassName="min-w-215"
    />
  );
};

export default LeadTable;
