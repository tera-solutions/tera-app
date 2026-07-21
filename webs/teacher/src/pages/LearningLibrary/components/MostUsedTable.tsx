import { StarSolid } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import Table, { TableColumn } from "_common/components/Table";
import { CARD_LINK } from "_common/constants/dashboard";

import type { MostUsedRow } from "../mock";

interface MostUsedTableProps {
  rows: MostUsedRow[];
}

const MostUsedTable = ({ rows }: MostUsedTableProps) => {
  const columns: TableColumn<MostUsedRow>[] = [
    {
      key: "index",
      title: "#",
      headerClassName: "w-10 px-4 py-3",
      render: (_row, index) => <span className="text-slate-400">{index + 1}</span>,
    },
    {
      key: "title",
      title: "Học liệu",
      render: (row) => <span className="font-medium text-slate-800">{row.title}</span>,
    },
    {
      key: "type",
      title: "Loại",
      render: (row) => (
        <Badge className="bg-sky-50 px-2.5 py-0.5 text-[11px] text-brand">{row.typeLabel}</Badge>
      ),
    },
    {
      key: "subject",
      title: "Môn",
      render: (row) => row.subject,
    },
    {
      key: "usage",
      title: "Lượt sử dụng",
      render: (row) => row.usageCount.toLocaleString("vi-VN"),
    },
    {
      key: "rating",
      title: "Đánh giá",
      render: (row) => (
        <span className="flex items-center gap-1 text-amber-500 [&_svg]:h-3.5 [&_svg]:w-3.5">
          <StarSolid /> {row.rating}
        </span>
      ),
    },
    {
      key: "updatedAt",
      title: "Cập nhật lần cuối",
      render: (row) => <span className="text-slate-500">{row.updatedAt}</span>,
    },
  ];

  return (
    <Card>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-800">Học liệu được sử dụng nhiều nhất</p>
        <button type="button" className={CARD_LINK}>
          Xem tất cả
        </button>
      </div>
      <Table columns={columns} data={rows} rowKey={(row) => row.id} minWidthClassName="min-w-160" />
    </Card>
  );
};

export default MostUsedTable;
