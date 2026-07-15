import { useMemo, useState } from "react";
import moment from "moment";

import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

import type { LeaveRequestItem } from "../_interface";
import LeaveRequestStatus from "./LeaveRequestStatus";

const fmt = (iso: string) => moment(iso).format("DD/MM/YYYY");

interface LeaveRequestTableProps {
  items: LeaveRequestItem[];
}

/** Bảng danh sách đơn xin nghỉ (dùng ở màn "Xem tất cả"), phân trang client-side. */
const LeaveRequestTable = ({ items }: LeaveRequestTableProps) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  const rows = useMemo(
    () => items.slice((page - 1) * perPage, page * perPage),
    [items, page, perPage],
  );

  const columns: TableColumn<LeaveRequestItem>[] = [
    {
      key: "type",
      title: "Loại nghỉ",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-slate-800">
          {r.typeLabel}
        </span>
      ),
    },
    {
      key: "range",
      title: "Thời gian nghỉ",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-700">
          {fmt(r.from)} - {fmt(r.to)}
        </span>
      ),
    },
    {
      key: "days",
      title: "Số ngày",
      render: (r) => <span className="whitespace-nowrap">{r.days} ngày</span>,
    },
    {
      key: "reason",
      title: "Lý do",
      render: (r) => (
        <span className="block max-w-[280px] truncate text-slate-600">
          {r.reason}
        </span>
      ),
    },
    {
      key: "createdAt",
      title: "Ngày tạo",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-500">{fmt(r.createdAt)}</span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <LeaveRequestStatus status={r.status} />,
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={rows}
        rowKey={(r) => r.id}
        emptyText="Không có đơn xin nghỉ phù hợp"
        minWidthClassName="min-w-[720px]"
      />
      <TablePagination
        total={items.length}
        page={page}
        perPage={perPage}
        unit="đơn"
        onChange={(p, size) => {
          setPage(size !== perPage ? 1 : p);
          setPerPage(size);
        }}
      />
    </>
  );
};

export default LeaveRequestTable;
