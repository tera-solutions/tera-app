import { useMemo } from "react";
import moment from "moment";
import { CalendarDaysOutlined } from "tera-dls";
import StatusBadge from "@tera/components/dof/StatusBadge";

import CalendarCard, { type CalendarCardEvent } from "_common/components/CalendarCard";
import IconBox from "_common/components/IconBox";
import { useMeta } from "_common/hooks/useMeta";

import type { LeaveRequestRow, LeaveStatus } from "../_interface";
import { toLeaveCalendarCardEvents } from "../_utils";

interface LeaveCalendarCardProps {
  items: LeaveRequestRow[];
}

// Ưu tiên khi 1 ngày dính nhiều đơn: đã duyệt > chờ duyệt > từ chối > đã hủy > hoàn thành.
const STATUS_PRIORITY: LeaveStatus[] = ["approved", "pending", "rejected", "cancelled", "completed"];

/** Lịch "Lịch nghỉ của tôi" — dùng chung `CalendarCard` với `/timesheet` (cùng UI,
 * cùng kích thước). Ngày agenda render chi tiết đơn xin nghỉ riêng cho trang này. */
const LeaveCalendarCard = ({ items }: LeaveCalendarCardProps) => {
  const { getItem, getLabel } = useMeta();

  const events = useMemo(() => toLeaveCalendarCardEvents(items, getItem), [items, getItem]);

  const legend = useMemo(
    () =>
      STATUS_PRIORITY.map((s) => getItem("leave_status", s))
        .filter((meta): meta is NonNullable<typeof meta> => !!meta)
        .map((meta) => ({ label: meta.label, color: meta.color })),
    [getItem],
  );

  return (
    <CalendarCard
      title="Lịch nghỉ của tôi"
      events={events}
      legend={legend}
      emptyDayText="Không có lịch nghỉ trong ngày này."
      renderDayEntry={(event: CalendarCardEvent<LeaveRequestRow>) => {
        const it = event.item;
        return (
          <div
            key={it.id}
            className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
          >
            <IconBox
              icon={<CalendarDaysOutlined />}
              sizeClassName="h-10 w-10"
              roundedClassName="rounded-xl"
              style={{ color: event.color, backgroundColor: event.backgroundColor }}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {it.requesterName ?? getLabel("leave_request_type", it.requestType)}
              </p>
              <p className="truncate text-xs text-slate-500">
                {it.leaveDate ? moment(it.leaveDate).format("DD/MM/YYYY") : "—"} · {it.reasonTypeLabel ?? "—"}
              </p>
              <p className="truncate text-xs text-slate-400">{it.reason}</p>
            </div>
            <StatusBadge name="leave_status" value={it.status} className="shrink-0" />
          </div>
        );
      }}
    />
  );
};

export default LeaveCalendarCard;
