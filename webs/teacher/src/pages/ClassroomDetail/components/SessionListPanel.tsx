import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import classNames from "classnames";

import Badge from "_common/components/Badge";
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

const STATUS_STYLE: Record<string, { label: string; badge: string }> = {
  completed: { label: "Đã học", badge: "bg-emerald-50 text-emerald-600" },
  done: { label: "Đã học", badge: "bg-emerald-50 text-emerald-600" },
  pending: { label: "Sắp tới", badge: "bg-sky-50 text-brand" },
  upcoming: { label: "Sắp tới", badge: "bg-sky-50 text-brand" },
  cancelled: { label: "Đã huỷ", badge: "bg-red-50 text-red-500" },
};

const SessionListPanel = ({
  sessions,
  loading,
  isError,
  onRetry,
}: SessionListPanelProps) => {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  // Reset back to page 1 whenever the underlying session list changes
  // (e.g. switching classes) so pagination doesn't get stuck out of range.
  useEffect(() => {
    setPage(1);
  }, [sessions]);

  const total = sessions.length;
  const pagedSessions = useMemo(
    () => sessions.slice((page - 1) * perPage, page * perPage),
    [sessions, page, perPage],
  );

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
            {pagedSessions.map((s) => {
              const style = STATUS_STYLE[s.status?.toLowerCase()] ?? {
                label: s.status || "—",
                badge: "bg-slate-100 text-slate-500",
              };
              return (
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
                    <Badge className={classNames("px-2.5 py-0.5 text-[11px]", style.badge)}>
                      {style.label}
                    </Badge>
                  </td>
                </tr>
              );
            })}
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
