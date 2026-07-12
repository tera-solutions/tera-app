import { useState } from "react";
import moment from "moment";
import { EyeOutlined } from "tera-dls";

import Card from "_common/components/Card";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import ScheduleDetailDrawer from "pages/Schedule/components/ScheduleDetailDrawer";

import type { ScheduleItem } from "../_interface";
import { formatDuration, sessionMinutes, weekdayLabel } from "../_utils";

interface TeachingSessionTableProps {
  rows: ScheduleItem[];
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number, perPage: number) => void;
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const TeachingSessionTable = ({
  rows,
  total,
  page,
  perPage,
  onPageChange,
  loading,
  isError,
  onRetry,
}: TeachingSessionTableProps) => {
  const [openId, setOpenId] = useState<number | null>(null);

  const columns: TableColumn<ScheduleItem>[] = [
    {
      key: "date",
      title: "Ngày",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-700">
          {r.date ? moment(r.date).format("DD/MM/YYYY") : "—"}
        </span>
      ),
    },
    { key: "weekday", title: "Thứ", render: (r) => weekdayLabel(r.date) },
    {
      key: "class",
      title: "Lớp học",
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-800">{r.class_name || "—"}</p>
          {r.level && <p className="truncate text-xs text-slate-400">{r.level}</p>}
        </div>
      ),
    },
    {
      key: "students",
      title: "Học viên",
      // Endpoint timetable không trả student_count → để "—" thay vì 0 sai lệch.
      render: (r) => (r.student_count ? r.student_count : <span className="text-slate-300">—</span>),
    },
    {
      key: "type",
      title: "Hình thức",
      // Chưa có learning_type trong payload timetable → chờ backend.
      render: () => <span className="text-slate-300">—</span>,
    },
    {
      key: "time",
      title: "Thời gian",
      render: (r) => (r.start_time ? `${r.start_time} - ${r.end_time}` : "—"),
    },
    {
      key: "hours",
      title: "Giờ giảng",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-slate-700">
          {formatDuration(sessionMinutes(r))}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <StatusBadge name="class_session_status" value={r.status} />,
    },
    {
      key: "note",
      title: "Ghi chú",
      // Chưa có field ghi chú buổi trong payload → chờ backend.
      render: () => <span className="text-slate-300">—</span>,
    },
    {
      key: "action",
      title: "",
      headerClassName: "px-4 py-3 w-10",
      render: (r) => (
        <button
          type="button"
          onClick={() => setOpenId(r.id)}
          aria-label="Xem chi tiết"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-sky-50 hover:text-brand [&_svg]:h-4 [&_svg]:w-4"
        >
          <EyeOutlined />
        </button>
      ),
    },
  ];

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-3 text-base font-semibold text-slate-800">Danh sách buổi dạy</p>
      <Table
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        isLoading={loading}
        isError={isError}
        onRetry={onRetry}
        emptyText="Không có buổi dạy trong khoảng thời gian này"
        minWidthClassName="min-w-[1040px]"
      />
      <TablePagination
        total={total}
        page={page}
        perPage={perPage}
        unit="buổi dạy"
        onChange={onPageChange}
      />
      <ScheduleDetailDrawer scheduleId={openId} onClose={() => setOpenId(null)} />
    </Card>
  );
};

export default TeachingSessionTable;
