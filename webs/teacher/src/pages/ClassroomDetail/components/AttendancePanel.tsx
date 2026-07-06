import { useMemo, useState } from "react";

import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import WidgetState from "_common/components/WidgetState";
import { AttendanceService } from "@tera/modules/education";

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

  return (
    <WidgetState
      isLoading={loading}
      isError={isError}
      isEmpty={!loading && records.length === 0}
      emptyText="Chưa có dữ liệu điểm danh"
      onRetry={() => refetch()}
    >
      <div className="flex flex-col gap-4">
        <SearchInput
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Tìm kiếm học viên..."
        />

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-120 text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="px-4 py-3">STT</th>
                <th className="px-4 py-3">Học viên</th>
                <th className="px-4 py-3">Mã HV</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pagedRecords.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-6 text-center text-slate-400">
                    Không có học viên phù hợp
                  </td>
                </tr>
              )}
              {pagedRecords.map((r, i) => (
                <tr key={r.id} className="text-slate-700">
                  <td className="px-4 py-3 text-slate-400">
                    {(page - 1) * perPage + i + 1}
                  </td>
                  <td className="px-4 py-3 font-medium">{r.student_name}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {r.student_code || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge name="attendance_status" value={r.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <TablePagination
          total={total}
          page={page}
          perPage={perPage}
          unit="học viên"
          onChange={handleChangePage}
        />
      </div>
    </WidgetState>
  );
};

export default AttendancePanel;
