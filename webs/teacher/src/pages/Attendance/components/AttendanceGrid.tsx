import { useMemo, useState } from "react";
import classNames from "classnames";
import { Button, CheckOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import Badge from "_common/components/Badge";
import SearchInput from "_common/components/SearchInput";
import WidgetState from "_common/components/WidgetState";
import { ATTENDANCE_STYLE } from "pages/ClassroomDetail/constants";

import type { AttendanceRow } from "../_interface";
import { STATUS_ACTIONS } from "../constants";

interface AttendanceGridProps {
  rows: AttendanceRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  selectedId: number | null;
  onSelect: (studentId: number) => void;
  onSetStatus: (studentId: number, status: AttendanceRow["status"]) => void;
  onMarkAllPresent: () => void;
}

const AttendanceGrid = ({
  rows,
  loading,
  isError,
  onRetry,
  selectedId,
  onSelect,
  onSetStatus,
  onMarkAllPresent,
}: AttendanceGridProps) => {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return rows;
    return rows.filter((r) => r.name.toLowerCase().includes(term));
  }, [rows, search]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Tìm kiếm học viên..."
          wrapperClassName="sm:max-w-xs"
        />
        <Button
          outlined
          icon={<CheckOutlined />}
          onClick={onMarkAllPresent}
          className="whitespace-nowrap text-emerald-600 border-emerald-500 hover:bg-emerald-500"
        >
          Đánh dấu có mặt tất cả
        </Button>
      </div>

      <WidgetState
        isLoading={loading}
        isError={isError}
        isEmpty={!loading && filtered.length === 0}
        emptyText="Không có học viên phù hợp"
        onRetry={onRetry}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6">
          {filtered.map((row) => {
            const style = ATTENDANCE_STYLE[row.status];
            const selected = row.student_id === selectedId;
            return (
              <button
                key={row.student_id}
                type="button"
                onClick={() => onSelect(row.student_id)}
                className={classNames(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
                  selected
                    ? "border-brand bg-sky-50/60"
                    : "border-slate-100 hover:border-slate-200",
                )}
              >
                <Avatar
                  src={row.avatar}
                  alt={row.name}
                  sizeClassName="h-12 w-12"
                  iconSizeClassName="[&_svg]:h-5 [&_svg]:w-5"
                  shrink={false}
                />
                <p className="w-full truncate text-xs font-medium text-slate-700">
                  {row.name}
                </p>
                <Badge className={`px-2 py-0.5 text-[10px] ${style.badge}`}>
                  {style.label}
                </Badge>
              </button>
            );
          })}
        </div>
      </WidgetState>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        {STATUS_ACTIONS.map((action) => (
          <Button
            key={action.status}
            outlined
            disabled={!selectedId}
            onClick={() => selectedId && onSetStatus(selectedId, action.status)}
            className={classNames(
              "whitespace-nowrap",
              ATTENDANCE_STYLE[action.status].button,
            )}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default AttendanceGrid;
