import { useMemo } from "react";
import { ChevronLeftOutlined, ChevronRightOutlined } from "tera-dls";

import Card from "_common/components/Card";

import type { TimesheetSessionRow } from "../_interface";

interface MonthCalendarCardProps {
  items: TimesheetSessionRow[];
  /** Tháng hiển thị (lấy từ range.from). */
  month: Date;
  /** Đổi tháng → set lại khoảng ngày cả trang về [đầu tháng, cuối tháng]. */
  onMonthChange: (firstDayOfMonth: Date) => void;
}

const WEEK_HEADERS_FULL = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const sameYmd = (d: Date, y: number, m: number, day: number) =>
  d.getFullYear() === y && d.getMonth() === m && d.getDate() === day;

/** Lịch tháng mini: chấm ngày có buổi dạy (đã điểm danh) + khoanh hôm nay. */
const MonthCalendarCard = ({ items, month, onMonthChange }: MonthCalendarCardProps) => {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();

  const daysWithSession = useMemo(() => {
    const set = new Set<number>();
    for (const it of items) {
      const [y, m, d] = String(it.sessionDate ?? "").split("-").map(Number);
      if (y === year && m - 1 === monthIndex) set.add(d);
    }
    return set;
  }, [items, year, monthIndex]);

  const cells = useMemo(() => {
    const firstDow = new Date(year, monthIndex, 1).getDay(); // 0=CN
    const lead = firstDow === 0 ? 6 : firstDow - 1; // Thứ 2 = cột đầu
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < lead; i += 1) arr.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) arr.push(d);
    return arr;
  }, [year, monthIndex]);

  const today = new Date();

  const navBtn =
    "flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 [&_svg]:h-4 [&_svg]:w-4";

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-3 flex items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">
          Lịch dạy tháng {String(monthIndex + 1).padStart(2, "0")}/{year}
        </p>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onMonthChange(new Date(today.getFullYear(), today.getMonth(), 1))}
            className="rounded-lg px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-sky-50"
          >
            Hôm nay
          </button>
          <button
            type="button"
            aria-label="Tháng trước"
            onClick={() => onMonthChange(new Date(year, monthIndex - 1, 1))}
            className={navBtn}
          >
            <ChevronLeftOutlined />
          </button>
          <button
            type="button"
            aria-label="Tháng sau"
            onClick={() => onMonthChange(new Date(year, monthIndex + 1, 1))}
            className={navBtn}
          >
            <ChevronRightOutlined />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400">
        {WEEK_HEADERS_FULL.map((h) => (
          <div key={h} className="py-1">
            {h}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const isToday = sameYmd(today, year, monthIndex, day);
          const hasSession = daysWithSession.has(day);
          return (
            <div key={day} className="relative flex items-center justify-center py-0.5">
              {hasSession && (
                <span className="absolute left-1/2 top-0.5 h-1 w-2 -translate-x-1/2 rounded-full bg-emerald-500" />
              )}
              <span
                className={[
                  "mx-auto flex aspect-square w-full max-w-9 items-center justify-center rounded-full",
                  isToday
                    ? "bg-brand font-semibold text-white"
                    : hasSession
                      ? "font-medium text-slate-700"
                      : "text-slate-600",
                ].join(" ")}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <span className="h-1 w-2 rounded-full bg-emerald-500" />
          Có buổi dạy
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          Hôm nay
        </span>
      </div>
    </Card>
  );
};

export default MonthCalendarCard;
