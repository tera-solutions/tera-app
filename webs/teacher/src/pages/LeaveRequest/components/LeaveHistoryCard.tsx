import moment from "moment";
import { CalendarDaysOutlined, ChevronRightOutlined } from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { LeaveRequestItem } from "../_interface";
import LeaveRequestStatus from "./LeaveRequestStatus";

interface LeaveHistoryCardProps {
  items: LeaveRequestItem[];
  /** Mở màn danh sách đơn đầy đủ. */
  onViewAll?: () => void;
}

const fmt = (iso: string) => moment(iso).format("DD/MM/YYYY");

// Nền ô icon theo trạng thái (nhạt hơn badge).
const ICON_BG: Record<string, string> = {
  approved: "bg-emerald-50 text-emerald-500",
  pending: "bg-amber-50 text-amber-500",
  rejected: "bg-rose-50 text-rose-500",
};

/** Danh sách lịch sử đơn xin nghỉ (rút gọn ở trang chính). */
const LeaveHistoryCard = ({ items, onViewAll }: LeaveHistoryCardProps) => (
  <Card animated={false}>
    <div className="mb-2 flex items-center justify-between">
      <p className="text-base font-semibold text-slate-800">Lịch sử đơn xin nghỉ</p>
      <button
        type="button"
        onClick={onViewAll}
        className="text-xs font-medium text-brand transition-colors hover:underline"
      >
        Xem tất cả
      </button>
    </div>

    <div className="divide-y divide-slate-100">
      {items.map((it) => {
        return (
          <button
            key={it.id}
            type="button"
            className="flex w-full items-center gap-3 py-3 text-left transition-colors hover:bg-slate-50/60"
          >
            <IconBox
              icon={<CalendarDaysOutlined />}
              sizeClassName="h-10 w-10"
              roundedClassName="rounded-xl"
              colorClassName={ICON_BG[it.status]}
            />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {it.typeLabel}
              </p>
              <p className="truncate text-xs text-slate-500">
                {fmt(it.from)} - {fmt(it.to)} ({it.days} ngày)
              </p>
              <p className="truncate text-xs text-slate-400">{it.reason}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <LeaveRequestStatus status={it.status} />
              <span className="flex items-center gap-1 text-[11px] text-slate-400">
                Đơn ngày {fmt(it.createdAt)}
                <ChevronRightOutlined className="h-3.5 w-3.5" />
              </span>
            </div>
          </button>
        );
      })}
    </div>
  </Card>
);

export default LeaveHistoryCard;
