import { useMemo, useState } from "react";
import { observer } from "mobx-react-lite";
import classNames from "classnames";
import { Button, CheckOutlined } from "tera-dls";

import Avatar from "_common/components/Avatar";
import SearchInput from "_common/components/SearchInput";
import StatusBadge from "_common/components/StatusBadge";
import WidgetState from "_common/components/WidgetState";
import { getOutlineButtonVariant } from "_common/utils/badgeColor";
import { useMeta } from "_common/hooks/useMeta";

import type { AttendanceRow } from "../_interface";
import { STATUS_ACTIONS } from "../constants";
import type { AttendanceStatus } from "pages/ClassroomDetail/_interface";

interface AttendanceGridProps {
  rows: AttendanceRow[];
  loading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  selectedIds: Set<number>;
  onToggleSelect: (studentId: number) => void;
  onSetStatus: (status: AttendanceStatus) => void;
  onMarkAllPresent: () => void;
  dirtyCount: number;
  saving?: boolean;
  onSave: () => void;
}

const AttendanceGrid = observer(({
  rows,
  loading,
  isError,
  onRetry,
  selectedIds,
  onToggleSelect,
  onSetStatus,
  onMarkAllPresent,
  dirtyCount,
  saving,
  onSave,
}: AttendanceGridProps) => {
  const { getItem } = useMeta();
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
          wrapperClassName="flex-1"
        />
        <div className="flex items-center gap-2">
          <Button
            outlined
            icon={<CheckOutlined />}
            onClick={onMarkAllPresent}
            disabled={saving}
            className="whitespace-nowrap text-emerald-600 border-emerald-500 hover:bg-emerald-500"
          >
            Đánh dấu có mặt tất cả
          </Button>
          <Button
            disabled={dirtyCount === 0 || saving}
            onClick={onSave}
            className="whitespace-nowrap"
          >
            {saving ? "Đang lưu..." : "Lưu điểm danh"}
          </Button>
        </div>
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
            const selected = selectedIds.has(row.student_id);
            return (
              <button
                key={row.student_id}
                type="button"
                onClick={() => onToggleSelect(row.student_id)}
                className={classNames(
                  "relative flex flex-col items-center gap-1.5 rounded-xl border p-3 text-center transition-colors",
                  selected
                    ? "border-brand bg-sky-50/60"
                    : "border-slate-100 hover:border-slate-200",
                )}
              >
                {selected && (
                  <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white [&_svg]:h-2.5 [&_svg]:w-2.5">
                    <CheckOutlined />
                  </span>
                )}
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
                {row.status ? (
                  <StatusBadge name="attendance_status" value={row.status} />
                ) : (
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] text-slate-400">
                    Chưa điểm danh
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </WidgetState>

      <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
        <span className="mr-1 text-xs text-slate-500">
          {selectedIds.size > 0
            ? `Đã chọn ${selectedIds.size} học viên`
            : "Chọn học viên để điểm danh"}
        </span>
        {STATUS_ACTIONS.map((action) => (
          <Button
            key={action.status}
            outlined
            disabled={selectedIds.size === 0}
            onClick={() => onSetStatus(action.status)}
            className={classNames(
              "whitespace-nowrap",
              getOutlineButtonVariant(getItem("attendance_status", action.status)?.color),
            )}
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
});

export default AttendanceGrid;
