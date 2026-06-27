import { useMemo } from "react";

import WidgetState from "_common/components/WidgetState";

import type { AttendanceRecord, AttendanceStatus } from "../_interface";
import { ATTENDANCE_STYLE } from "../constants";

interface AttendancePanelProps {
  records: AttendanceRecord[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
}

const SUMMARY: { key: AttendanceStatus; label: string; tone: string }[] = [
  { key: "present", label: "Có mặt", tone: "text-emerald-600" },
  { key: "absent", label: "Vắng", tone: "text-red-500" },
  { key: "late", label: "Muộn", tone: "text-amber-600" },
];

const AttendancePanel = ({
  records,
  loading,
  isError,
  onRetry,
}: AttendancePanelProps) => {
  const counts = useMemo(() => {
    const map: Record<string, number> = {};
    records.forEach((r) => {
      map[r.status] = (map[r.status] ?? 0) + 1;
    });
    return map;
  }, [records]);

  const sessionName = records[0]?.session_name;

  return (
    <WidgetState
      isLoading={loading}
      isError={isError}
      isEmpty={!loading && records.length === 0}
      emptyText="Chưa có dữ liệu điểm danh"
      onRetry={onRetry}
    >
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm font-medium text-slate-600">
            Buổi điểm danh gần nhất
            {sessionName ? `: ${sessionName}` : ""}
          </p>
          <div className="flex items-center gap-3">
            {SUMMARY.map((s) => (
              <div key={s.key} className="text-center">
                <p className={`text-lg font-bold ${s.tone}`}>
                  {counts[s.key] ?? 0}
                </p>
                <p className="text-[11px] text-slate-400">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-100">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
                <th className="px-4 py-3">STT</th>
                <th className="px-4 py-3">Học viên</th>
                <th className="px-4 py-3">Mã HV</th>
                <th className="px-4 py-3">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {records.map((r, i) => {
                const style = ATTENDANCE_STYLE[r.status];
                return (
                  <tr key={r.id} className="text-slate-700">
                    <td className="px-4 py-3 text-slate-400">{i + 1}</td>
                    <td className="px-4 py-3 font-medium">{r.student_name}</td>
                    <td className="px-4 py-3 text-slate-500">
                      {r.student_code || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${style.badge}`}
                      >
                        {r.status_label || style.label}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </WidgetState>
  );
};

export default AttendancePanel;
