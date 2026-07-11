import { useMemo, useState } from "react";

import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { AttendanceService } from "@tera/modules/education";

import type { AttendanceRecord } from "../_interface";
import { toAttendanceRecords } from "../_utils";

interface AttendancePanelProps {
  classId: number | null;
}

const AttendancePanel = ({ classId }: AttendancePanelProps) => {
  const listParams = { class_id: classId ?? 0, per_page: 100 };
  const query = AttendanceService.useAttendanceList({ params: listParams });
  const { isLoading: loading, isError, refetch } = query;
  const records = useMemo(
    () => toAttendanceRecords(query.data?.data?.items),
    [query.data],
  );

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");

  const filteredRecords = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return records;
    return records.filter(
      (r) =>
        r.student_name.toLowerCase().includes(term) ||
        r.student_code.toLowerCase().includes(term),
    );
  }, [records, search]);

  const total = filteredRecords.length;
  const pagedRecords = useMemo(
    () => filteredRecords.slice((page - 1) * perPage, page * perPage),
    [filteredRecords, page, perPage],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== perPage) {
      setPerPage(nextSize);
      setPage(1);
    } else {
      setPage(nextPage);
    }
  };

  const columns: TableColumn<AttendanceRecord>[] = [
    {
      key: "stt",
      title: "STT",
      cellClassName: "px-4 py-3 text-slate-400",
      render: (r, i) => (page - 1) * perPage + i + 1,
    },
    { key: "student_name", title: "Học viên", cellClassName: "px-4 py-3 font-medium", render: (r) => r.student_name },
    {
      key: "student_code",
      title: "Mã HV",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (r) => r.student_code || "—",
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (r) => <StatusBadge name="attendance_status" value={r.status} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <SearchInput
        value={search}
        onChange={(e) => handleSearchChange(e.target.value)}
        placeholder="Tìm kiếm học viên..."
      />

      <Table
        columns={columns}
        data={pagedRecords}
        rowKey={(r) => r.id}
        isLoading={loading}
        isError={isError}
        onRetry={() => refetch()}
        errorMessage="Không tải được dữ liệu điểm danh"
        emptyText={records.length === 0 ? "Chưa có dữ liệu điểm danh" : "Không có học viên phù hợp"}
        minWidthClassName="min-w-120"
      />

      <TablePagination
        total={total}
        page={page}
        perPage={perPage}
        unit="học viên"
        onChange={handleChangePage}
      />
    </div>
  );
};

export default AttendancePanel;
