import { useEffect, useMemo, useState } from "react";
import moment from "moment";

import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import WidgetState from "_common/components/WidgetState";

import type { ClassSession } from "../_interface";

interface SessionListPanelProps {
  sessions: ClassSession[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const SessionListPanel = ({
  sessions,
  loading,
  isError,
  onRetry,
}: SessionListPanelProps) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);
  const [search, setSearch] = useState("");

  // Reset back to page 1 whenever the underlying session list changes
  // (e.g. switching classes) so pagination doesn't get stuck out of range.
  useEffect(() => {
    setPage(1);
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return sessions;
    return sessions.filter((s) => (s.name || "").toLowerCase().includes(term));
  }, [sessions, search]);

  const total = filteredSessions.length;
  const pagedSessions = useMemo(
    () => filteredSessions.slice((page - 1) * perPage, page * perPage),
    [filteredSessions, page, perPage],
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
      isEmpty={!loading && sessions.length === 0}
      emptyText="Chưa có buổi học nào"
      onRetry={onRetry}
    >
      <div className="mb-3">
        <SearchInput
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Tìm kiếm buổi học..."
        />
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-100">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
              <th className="px-4 py-3">Buổi</th>
              <th className="px-4 py-3">Nội dung</th>
              <th className="px-4 py-3">Ngày</th>
              <th className="px-4 py-3">Thời gian</th>
              <th className="px-4 py-3">Trạng thái</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pagedSessions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-slate-400">
                  Không có buổi học phù hợp
                </td>
              </tr>
            )}
            {pagedSessions.map((s) => (
              <tr key={s.id} className="text-slate-700">
                <td className="px-4 py-3 font-medium">
                  {s.session_no != null ? `Buổi ${s.session_no}` : "—"}
                </td>
                <td className="px-4 py-3">{s.name || "—"}</td>
                <td className="px-4 py-3 text-slate-500">
                  {s.date ? moment(s.date, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {s.start_time && s.end_time
                    ? `${s.start_time} - ${s.end_time}`
                    : "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge name="class_session_status" value={s.status} />
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
        unit="buổi học"
        onChange={handleChangePage}
      />
    </WidgetState>
  );
};

export default SessionListPanel;
