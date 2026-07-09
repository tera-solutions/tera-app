import moment from "moment";

import Avatar from "_common/components/Avatar";
import Table, { TableColumn } from "_common/components/Table";

import type { StudentEvaluationRow } from "../_interface";

interface StudentEvaluationTableProps {
  rows: StudentEvaluationRow[];
  selectedId: number | null;
  onSelect: (row: StudentEvaluationRow) => void;
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

const StudentEvaluationTable = ({
  rows,
  selectedId,
  onSelect,
  isLoading,
  isError,
  onRetry,
}: StudentEvaluationTableProps) => {
  const columns: TableColumn<StudentEvaluationRow>[] = [
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar src={row.avatar} alt={row.student_name} />
          <p className="truncate font-medium text-slate-800">{row.student_name || "—"}</p>
        </div>
      ),
    },
    {
      key: "avg_score",
      title: "Điểm TB",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (row) => row.avg_score ?? "—",
    },
    {
      key: "latest_comment",
      title: "Nhận xét gần nhất",
      cellClassName: "max-w-56 truncate px-4 py-3 text-slate-500",
      render: (row) => row.latest_comment || "—",
    },
    {
      key: "updated_at",
      title: "Cập nhật",
      cellClassName: "px-4 py-3 text-slate-400",
      render: (row) => (row.updated_at ? moment(row.updated_at).format("DD/MM/YYYY") : "—"),
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(row) => row.student_id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được danh sách học viên"
      emptyText="Lớp học chưa có học viên"
      minWidthClassName="min-w-140"
      onRowClick={onSelect}
      rowClassName={(row) => (selectedId === row.student_id ? "bg-sky-50" : "")}
    />
  );
};

export default StudentEvaluationTable;
