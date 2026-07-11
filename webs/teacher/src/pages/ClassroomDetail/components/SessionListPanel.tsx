import { useEffect, useMemo, useState } from "react";
import moment from "moment";

import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";

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

  const columns: TableColumn<ClassSession>[] = [
    {
      key: "session_no",
      title: "Buổi",
      cellClassName: "px-4 py-3 font-medium",
      render: (s) => (s.session_no != null ? `Buổi ${s.session_no}` : "—"),
    },
    { key: "name", title: "Nội dung", render: (s) => s.name || "—" },
    {
      key: "date",
      title: "Ngày",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (s) => (s.date ? moment(s.date, "YYYY-MM-DD").format("DD/MM/YYYY") : "—"),
    },
    {
      key: "time",
      title: "Thời gian",
      cellClassName: "px-4 py-3 text-slate-500",
      render: (s) => (s.start_time && s.end_time ? `${s.start_time} - ${s.end_time}` : "—"),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (s) => <StatusBadge name="class_session_status" value={s.status} />,
    },
  ];

  return (
    <div>
      <div className="mb-3">
        <SearchInput
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Tìm kiếm buổi học..."
        />
      </div>

      <Table
        columns={columns}
        data={pagedSessions}
        rowKey={(s) => s.id}
        isLoading={loading}
        isError={isError}
        onRetry={onRetry}
        errorMessage="Không tải được danh sách buổi học"
        emptyText={sessions.length === 0 ? "Chưa có buổi học nào" : "Không có buổi học phù hợp"}
        minWidthClassName="min-w-[560px]"
      />

      <TablePagination
        total={total}
        page={page}
        perPage={perPage}
        unit="buổi học"
        onChange={handleChangePage}
      />
    </div>
  );
};

export default SessionListPanel;
