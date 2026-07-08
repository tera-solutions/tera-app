import classNames from "classnames";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import Table, { TableColumn } from "_common/components/Table";

import type { RankingRow } from "../_interface";
import { MEDAL_COLOR } from "../constants";
import Sparkline from "./Sparkline";

interface RankingTableProps {
  rows: RankingRow[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const RankingTable = ({ rows, isLoading, isError, onRetry }: RankingTableProps) => {
  const columns: TableColumn<RankingRow & { rank: number }>[] = [
    {
      key: "rank",
      title: "#",
      headerClassName: "px-4 py-3 w-12",
      cellClassName: "px-4 py-3",
      render: (row) =>
        row.rank <= 3 ? (
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-white"
            style={{ backgroundColor: MEDAL_COLOR[row.rank - 1] }}
          >
            {row.rank}
          </span>
        ) : (
          <span className="text-sm text-slate-500">{row.rank}</span>
        ),
    },
    {
      key: "student",
      title: "Học viên",
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={row.student_avatar} alt={row.student_name} sizeClassName="h-8 w-8" />
          <div>
            <p className="font-medium text-slate-700">{row.student_name}</p>
            <p className="text-xs text-slate-400">{row.class_name}</p>
          </div>
        </div>
      ),
    },
    {
      key: "score",
      title: "Điểm số",
      headerClassName: "px-3 py-3 text-center",
      cellClassName: "px-3 py-3 text-center",
      render: (row) => <span className="font-semibold text-slate-700">{row.score ?? "—"}</span>,
    },
    {
      key: "classification",
      title: "Xếp loại",
      render: (row) =>
        row.classification_label ? (
          <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">
            {row.classification_label}
          </Badge>
        ) : (
          "—"
        ),
    },
    {
      key: "trend",
      title: "Tiến bộ",
      render: (row) => <Sparkline values={row.history} />,
    },
  ];

  return (
    <Table
      columns={columns}
      data={rows.map((row, i) => ({ ...row, rank: i + 1 }))}
      rowKey={(row) => row.student_id}
      isLoading={isLoading}
      isError={isError}
      onRetry={onRetry}
      errorMessage="Không tải được bảng xếp hạng"
      emptyText="Chưa có dữ liệu đánh giá để xếp hạng"
      minWidthClassName="min-w-140"
      rowClassName={(row) => classNames(row.rank <= 3 && "bg-amber-50/40")}
    />
  );
};

export default RankingTable;
