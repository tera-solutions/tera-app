import classNames from "classnames";
import { ArrowTrendingDownOutlined, ArrowTrendingUpOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Table, { TableColumn } from "_common/components/Table";

interface ProgressRow {
  student_id: number;
  student_name: string;
  student_avatar: string;
  prev_month_score: number | null;
  curr_month_score: number | null;
  delta_pct: number;
}

interface ProgressTableProps {
  rows: ProgressRow[];
  isLoading?: boolean;
}

const ProgressTable = ({ rows, isLoading }: ProgressTableProps) => {
  const columns: TableColumn<ProgressRow>[] = [
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={row.student_avatar} alt={row.student_name} sizeClassName="h-8 w-8" />
          <span className="font-medium text-slate-700">{row.student_name}</span>
        </div>
      ),
    },
    {
      key: "prev",
      title: "Điểm kỳ trước",
      headerClassName: "px-3 py-3 text-center",
      cellClassName: "px-3 py-3 text-center",
      render: (row) => row.prev_month_score?.toFixed(1),
    },
    {
      key: "curr",
      title: "Điểm kỳ này",
      headerClassName: "px-3 py-3 text-center",
      cellClassName: "px-3 py-3 text-center",
      render: (row) => row.curr_month_score?.toFixed(1),
    },
    {
      key: "delta",
      title: "% Tăng/Giảm",
      render: (row) => (
        <span
          className={classNames(
            "flex items-center gap-1 font-medium [&_svg]:h-4 [&_svg]:w-4",
            row.delta_pct >= 0 ? "text-emerald-600" : "text-red-500",
          )}
        >
          {row.delta_pct >= 0 ? <ArrowTrendingUpOutlined /> : <ArrowTrendingDownOutlined />}
          {row.delta_pct >= 0 ? "+" : ""}
          {row.delta_pct}%
        </span>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows}
      rowKey={(row) => row.student_id}
      isLoading={isLoading}
      emptyText="Chưa đủ dữ liệu 2 kỳ liên tiếp để so sánh tiến bộ"
    />
  );
};

export default ProgressTable;
