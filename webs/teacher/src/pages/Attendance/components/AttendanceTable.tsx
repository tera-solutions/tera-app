import { useMemo, useState } from "react";

import Avatar from "_common/components/Avatar";
import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";

import type { AttendanceRow } from "../_interface";

interface AttendanceTableProps {
  rows: AttendanceRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

/** Read-only attendance list for a session — no marking/saving, just a browse view. */
const AttendanceTable = ({ rows, loading, isError, onRetry }: AttendanceTableProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter(
      (r) => r.name.toLowerCase().includes(term) || r.code.toLowerCase().includes(term),
    );
  }, [rows, search]);

  const columns: TableColumn<AttendanceRow>[] = [
    {
      key: "stt",
      title: "STT",
      cellClassName: "px-4 py-3 text-slate-400",
      render: (_r, i) => i + 1,
    },
    {
      key: "name",
      title: "Học viên",
      cellClassName: "px-4 py-3 font-medium",
      render: (r) => (
        <div className="flex items-center gap-2">
          <Avatar src={r.avatar} alt={r.name} sizeClassName="h-8 w-8" shrink={false} />
          {r.name}
        </div>
      ),
    },
    {
      key: "code",
      title: "Mã HV",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (r) => r.code || "—",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) =>
        r.status ? (
          <StatusBadge name="attendance_status" value={r.status} />
        ) : (
          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-400">
            Chưa điểm danh
          </span>
        ),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <SearchInput
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Tìm kiếm học viên..."
      />

      <Table
        columns={columns}
        data={filtered}
        rowKey={(r) => r.student_id}
        isLoading={loading}
        isError={isError}
        onRetry={onRetry}
        errorMessage="Không tải được dữ liệu điểm danh"
        emptyText={rows.length === 0 ? "Chưa có học viên nào" : "Không có học viên phù hợp"}
        minWidthClassName="min-w-120"
      />
    </div>
  );
};

export default AttendanceTable;
