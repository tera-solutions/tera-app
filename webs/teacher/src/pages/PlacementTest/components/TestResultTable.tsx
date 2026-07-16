import moment from "moment";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";

import type { PlacementTestResultRow } from "../_interface";

interface TestResultTableProps {
  items: PlacementTestResultRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const TestResultTable = ({ items, loading, isError, onRetry }: TestResultTableProps) => {
  const columns: TableColumn<PlacementTestResultRow>[] = [
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Avatar sizeClassName="h-7 w-7" />
          <span className="truncate">{row.studentName ?? "—"}</span>
        </div>
      ),
    },
    { key: "score", title: "Điểm số", render: (row) => row.score ?? "—" },
    {
      key: "level",
      title: "Trình độ",
      render: (row) =>
        row.cefrResult ? (
          <Badge className="bg-sky-50 px-2.5 py-1 text-xs font-semibold text-brand">{row.cefrResult}</Badge>
        ) : (
          "—"
        ),
    },
    { key: "completion", title: "Tỷ lệ hoàn thành", render: (row) => `${row.completionRate}%` },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <Badge
          className={`px-2.5 py-1 text-xs ${
            row.status === "completed" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
          }`}
        >
          {row.status === "completed" ? "Đã hoàn thành" : "Đang làm"}
        </Badge>
      ),
    },
    {
      key: "completed_at",
      title: "Thời gian",
      render: (row) => (row.completedAt ? moment(row.completedAt).format("DD/MM/YYYY HH:mm") : "—"),
    },
  ];

  return (
    <Table
      columns={columns}
      data={items}
      rowKey={(row) => row.id}
      isLoading={loading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được kết quả học viên"
      emptyText="Chưa có kết quả nào"
      minWidthClassName="min-w-160"
    />
  );
};

export default TestResultTable;
