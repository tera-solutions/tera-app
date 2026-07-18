import moment from "moment";
import { CalendarDaysOutlined, CheckOutlined, NoSymbolOutlined, XMarkOutlined } from "tera-dls";
import StatusBadge from "@tera/components/dof/StatusBadge";

import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import TableRowActions from "_common/components/TableRowActions";
import { useMeta } from "_common/hooks/useMeta";

import type { LeaveRequestRow } from "../_interface";

const fmt = (iso: string | null) => (iso ? moment(iso).format("DD/MM/YYYY") : "—");

interface LeaveRequestTableProps {
  items: LeaveRequestRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  total: number;
  page: number;
  perPage: number;
  onPageChange: (page: number, perPage: number) => void;
  onApprove: (row: LeaveRequestRow) => void;
  onReject: (row: LeaveRequestRow) => void;
  onCancel: (row: LeaveRequestRow) => void;
  onScheduleMakeup: (row: LeaveRequestRow) => void;
}

/** Bảng danh sách đơn xin nghỉ (màn "Xem tất cả"), phân trang server-side. */
const LeaveRequestTable = ({
  items,
  loading,
  isError,
  onRetry,
  total,
  page,
  perPage,
  onPageChange,
  onApprove,
  onReject,
  onCancel,
  onScheduleMakeup,
}: LeaveRequestTableProps) => {
  const { getLabel } = useMeta();

  const columns: TableColumn<LeaveRequestRow>[] = [
    {
      key: "code",
      title: "Mã đơn",
      render: (r) => <span className="font-medium text-brand">{r.code}</span>,
    },
    {
      key: "type",
      title: "Loại đơn",
      render: (r) => <span className="whitespace-nowrap">{getLabel("leave_request_type", r.requestType)}</span>,
    },
    {
      key: "requester",
      title: "Người xin nghỉ",
      render: (r) => r.requesterName ?? `#${r.requesterId}`,
    },
    {
      key: "leaveDate",
      title: "Ngày nghỉ",
      render: (r) => <span className="whitespace-nowrap">{fmt(r.leaveDate)}</span>,
    },
    {
      key: "reason",
      title: "Lý do",
      render: (r) => (
        <div className="max-w-[220px]">
          <p className="truncate text-slate-700">{r.reasonTypeLabel}</p>
          {r.reason && <p className="truncate text-xs text-slate-400">{r.reason}</p>}
        </div>
      ),
    },
    {
      key: "makeup",
      title: "Học bù",
      render: (r) =>
        r.makeups.length === 0 ? (
          "—"
        ) : (
          <span className="text-xs text-slate-500">
            {r.makeups[0].status === "waiting" ? "Chờ xếp lịch" : r.makeups[0].makeupLessonLabel ?? "—"}
          </span>
        ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <StatusBadge name="leave_status" value={r.status} />,
    },
    {
      key: "actions",
      title: "",
      headerClassName: "w-24",
      render: (r) => {
        const menuItems: { key: string; label: string; icon: React.ReactNode; onClick: () => void }[] = [];
        if (r.status === "pending") {
          menuItems.push({ key: "approve", label: "Duyệt", icon: <CheckOutlined />, onClick: () => onApprove(r) });
          menuItems.push({ key: "reject", label: "Từ chối", icon: <XMarkOutlined />, onClick: () => onReject(r) });
          menuItems.push({ key: "cancel", label: "Hủy đơn", icon: <NoSymbolOutlined />, onClick: () => onCancel(r) });
        }
        const waitingMakeup = r.makeups.find((m) => m.status === "waiting");
        if (waitingMakeup) {
          menuItems.push({
            key: "schedule-makeup",
            label: "Xếp lịch học bù",
            icon: <CalendarDaysOutlined />,
            onClick: () => onScheduleMakeup(r),
          });
        }
        if (menuItems.length === 0) return null;
        return <TableRowActions buttons={[]} menuItems={menuItems} />;
      },
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={items}
        rowKey={(r) => r.id}
        isLoading={loading}
        isError={isError}
        onRetry={onRetry}
        errorMessage="Không tải được danh sách đơn xin nghỉ"
        emptyText="Không có đơn xin nghỉ phù hợp"
        minWidthClassName="min-w-[900px]"
      />
      <div className="mt-3">
        <TablePagination total={total} page={page} perPage={perPage} unit="đơn" onChange={onPageChange} />
      </div>
    </>
  );
};

export default LeaveRequestTable;
