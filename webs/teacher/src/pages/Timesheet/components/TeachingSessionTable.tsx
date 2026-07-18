import { useState } from "react";
import moment from "moment";
import { EyeOutlined, StarSolid } from "tera-dls";

import Badge from "_common/components/Badge";
import Card from "_common/components/Card";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { useMeta } from "_common/hooks/useMeta";
import ScheduleDetailDrawer from "pages/Schedule/components/ScheduleDetailDrawer";

import type { TimesheetSessionRow } from "../_interface";
import { formatDuration, weekdayLabel } from "../_utils";

interface TeachingSessionTableProps {
  rows: TimesheetSessionRow[];
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
  const { getLabel } = useMeta();
  const [openId, setOpenId] = useState<number | null>(null);

  const columns: TableColumn<TimesheetSessionRow>[] = [
    {
      key: "date",
      title: "Ngày",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-700">
          {r.sessionDate ? moment(r.sessionDate).format("DD/MM/YYYY") : "—"}
        </span>
      ),
    },
    { key: "weekday", title: "Thứ", render: (r) => weekdayLabel(r.sessionDate) },
    {
      key: "class",
      title: "Lớp học",
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-800">{r.className || "—"}</p>
          {r.roomName && <p className="truncate text-xs text-slate-400">{r.roomName}</p>}
        </div>
      ),
    },
    {
      key: "attendance",
      title: "Điểm danh",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-600">
          {r.presentCount}/{r.attendancesCount} có mặt
        </span>
      ),
    },
    {
      key: "type",
      title: "Hình thức",
      render: (r) => (
        <span className="whitespace-nowrap text-slate-600">
          {r.learningType ? getLabel("class_learning_type", r.learningType) : "—"}
        </span>
      ),
    },
    {
      key: "time",
      title: "Thời gian",
      render: (r) => (r.startTime ? `${r.startTime.slice(0, 5)} - ${r.endTime?.slice(0, 5)}` : "—"),
    },
    {
      key: "hours",
      title: "Giờ giảng",
      render: (r) => (
        <span className="whitespace-nowrap font-medium text-slate-700">
          {formatDuration(r.hours)}
        </span>
      ),
    },
    {
      key: "rating",
      title: "Đánh giá",
      render: (r) =>
        r.averageRating === null ? (
          <span className="text-slate-300">—</span>
        ) : (
          <span className="flex items-center gap-1 whitespace-nowrap text-amber-500">
            <StarSolid className="h-3.5 w-3.5" />
            {r.averageRating}
          </span>
        ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: () => (
        <Badge className="whitespace-nowrap bg-emerald-50 px-2.5 py-0.5 text-[11px] text-emerald-600">
          Đã điểm danh
        </Badge>
      ),
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
        emptyText="Không có buổi dạy nào đã điểm danh trong khoảng thời gian này"
        minWidthClassName="min-w-[1080px]"
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
