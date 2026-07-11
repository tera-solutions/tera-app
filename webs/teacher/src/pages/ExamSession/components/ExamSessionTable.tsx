import { useNavigate } from "react-router-dom";
import moment from "moment";
import { CalendarDaysOutlined, EyeOutlined, MapPinOutlined, UsersOutlined } from "tera-dls";

import Table, { TableColumn } from "_common/components/Table";
import StatusBadge from "_common/components/StatusBadge";
import { PATHS } from "_common/components/Layout/Menu/menus";

import type { ExamSessionRow } from "../_interface";
import { EXAM_SESSION_STATUS_META } from "../constants";

interface ExamSessionTableProps {
  data: ExamSessionRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const ExamSessionTable = ({ data, isLoading, isError, onRetry }: ExamSessionTableProps) => {
  const navigate = useNavigate();

  const columns: TableColumn<ExamSessionRow>[] = [
    {
      key: "exam",
      title: "Bài kiểm tra",
      render: (row) => <span className="font-medium text-slate-700">{row.exam_name || "—"}</span>,
    },
    {
      key: "class",
      title: "Lớp",
      render: (row) => <span className="text-slate-600">{row.class_name || "—"}</span>,
    },
    {
      key: "date",
      title: "Thời gian",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <CalendarDaysOutlined className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>
            {row.exam_date ? moment(row.exam_date).format("DD/MM/YYYY") : "—"}
            {row.start_time ? ` (${row.start_time}${row.end_time ? ` - ${row.end_time}` : ""})` : ""}
          </span>
        </div>
      ),
    },
    {
      key: "room",
      title: "Phòng thi",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <MapPinOutlined className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>{row.room_name || "—"}</span>
        </div>
      ),
    },
    {
      key: "registrations",
      title: "Sĩ số",
      render: (row) => (
        <div className="flex items-center gap-1.5 text-slate-600">
          <UsersOutlined className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          <span>{row.registrations_count}</span>
        </div>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusBadge name={EXAM_SESSION_STATUS_META} value={row.status} />,
    },
    {
      key: "actions",
      title: "Thao tác",
      headerClassName: "px-4 py-3 text-right",
      cellClassName: "px-4 py-3 text-right",
      render: (row) => (
        <div className="flex items-center justify-end" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            title="Xem chi tiết"
            onClick={() => navigate(`${PATHS.exam}/${row.exam_id}`)}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
          >
            <EyeOutlined />
          </button>
        </div>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={data}
      rowKey={(row) => row.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách bài kiểm tra"
      emptyText="Chưa có lịch kiểm tra nào"
      minWidthClassName="min-w-180"
      onRowClick={(row) =>
        navigate(row.exam_id ? `${PATHS.exam}/${row.exam_id}` : `${PATHS.exam}/session/${row.id}`)
      }
    />
  );
};

export default ExamSessionTable;
