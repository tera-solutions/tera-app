import Card from "_common/components/Card";
import Table, { TableColumn } from "_common/components/Table";

import type { ClassIncomeRow } from "../_interface";
import { formatNumber } from "../_utils";

interface ClassIncomeTableProps {
  rows: ClassIncomeRow[];
  total: number;
}

const ClassIncomeTable = ({ rows, total }: ClassIncomeTableProps) => {
  const cell = "px-1.5 py-2.5 text-[13px]";
  const head = "whitespace-nowrap px-1.5 py-2.5 text-[11px]";
  const columns: TableColumn<ClassIncomeRow>[] = [
    {
      key: "className",
      title: "Lớp học",
      headerClassName: head,
      cellClassName: cell,
      render: (r) => <span className="font-medium text-slate-700">{r.className}</span>,
    },
    { key: "sessionCount", title: "Số buổi", headerClassName: head, cellClassName: cell, render: (r) => <span className="text-slate-600">{r.sessionCount}</span> },
    { key: "hours", title: "Số giờ", headerClassName: head, cellClassName: cell, render: (r) => <span className="text-slate-600">{r.hours}h</span> },
    { key: "unitPrice", title: "Đơn giá/giờ", headerClassName: head, cellClassName: cell, render: (r) => <span className="whitespace-nowrap text-slate-600">{formatNumber(r.unitPrice)}</span> },
    { key: "total", title: "Thành tiền", headerClassName: `${head} text-right`, cellClassName: `${cell} text-right`, render: (r) => <span className="whitespace-nowrap font-medium text-slate-700">{formatNumber(r.total)}</span> },
  ];

  return (
    <Card className="xmd:p-5" animated={false}>
      <p className="mb-3 text-base font-semibold text-slate-800">Chi tiết thu nhập theo lớp học</p>
      <Table columns={columns} data={rows} rowKey={(r) => r.classId ?? r.className} emptyText="Chưa có dữ liệu lớp học" />
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
        <span className="text-sm font-semibold text-brand">Tổng cộng</span>
        <span className="text-base font-bold text-brand">{formatNumber(total)}đ</span>
      </div>
    </Card>
  );
};

export default ClassIncomeTable;
