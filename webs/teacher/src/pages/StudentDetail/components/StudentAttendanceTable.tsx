import moment from "moment";

import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";

import type { AttendanceHistoryRow } from "../_interface";

interface StudentAttendanceTableProps {
  rows: AttendanceHistoryRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const StudentAttendanceTable = ({ rows, isLoading, isError, onRetry }: StudentAttendanceTableProps) => {
  const columns: TableColumn<AttendanceHistoryRow>[] = [
    {
      key: "session",
      title: "Buổi",
      cellClassName: "px-4 py-3 font-medium",
      render: (r) => (r.session_no != null ? `Buổi ${r.session_no}` : r.session_name || "—"),
    },
    {
      key: "date",
      title: "Ngày",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (r) => (r.session_date ? moment(r.session_date, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <StatusBadge name="attendance_status" value={r.status} />,
    },
    {
      key: "note",
      title: "Ghi chú",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (r) => r.note || "—",
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(r) => r.id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được lịch sử điểm danh"
      emptyText="Chưa có dữ liệu điểm danh"
      minWidthClassName="min-w-[520px]"
    />
  );
};

export default StudentAttendanceTable;
