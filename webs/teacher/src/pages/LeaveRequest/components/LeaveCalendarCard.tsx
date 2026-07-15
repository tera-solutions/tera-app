import { useMemo, useState } from "react";
import moment from "moment";
import {
  CalendarDaysOutlined,
  ChevronLeftOutlined,
  ChevronRightOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import IconBox from "_common/components/IconBox";

import type { LeaveRequestItem, LeaveStatus } from "../_interface";
import LeaveRequestStatus, { LEAVE_STATUS_META } from "./LeaveRequestStatus";

interface LeaveCalendarCardProps {
  items: LeaveRequestItem[];
}

type ViewMode = "month" | "week" | "day";

const WEEK_HEADERS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
const VIEW_TABS: { key: ViewMode; label: string }[] = [
  { key: "month", label: "Tháng" },
  { key: "week", label: "Tuần" },
  { key: "day", label: "Ngày" },
];
// Thứ trong tuần theo moment().day() (0 = Chủ nhật).
const VN_DOW = [
  "Chủ nhật",
  "Thứ Hai",
  "Thứ Ba",
  "Thứ Tư",
  "Thứ Năm",
  "Thứ Sáu",
  "Thứ Bảy",
];

// Ưu tiên khi 1 ngày dính nhiều đơn: đã duyệt > chờ duyệt > từ chối.
const STATUS_PRIORITY: LeaveStatus[] = ["approved", "pending", "rejected"];
// Nền + chữ cho ô ngày nghỉ (lịch tháng) theo trạng thái.
const DAY_FILL: Record<LeaveStatus, string> = {
  approved: "bg-emerald-100 text-emerald-700 font-semibold",
  pending: "bg-amber-100 text-amber-700 font-semibold",
  rejected: "bg-rose-100 text-rose-700 font-semibold",
};

/** Lịch "Lịch nghỉ của tôi" — 3 chế độ xem: Tháng / Tuần / Ngày. */
const LeaveCalendarCard = ({ items }: LeaveCalendarCardProps) => {
  const [view, setView] = useState<ViewMode>("month");
  // Con trỏ thời gian: tháng (month view) / tuần chứa nó (week) / đúng ngày (day).
  const [cursor, setCursor] = useState(() => moment());

  const today = moment();
  const isToday = (d: moment.Moment) => d.isSame(today, "day");

  /** Các đơn nghỉ phủ 1 ngày (from..to bao gồm). */
  const entriesOn = useMemo(
    () => (d: moment.Moment) =>
      items.filter(
        (it) =>
          d.isSameOrAfter(moment(it.from), "day") &&
          d.isSameOrBefore(moment(it.to), "day"),
      ),
    [items],
  );

  /** Điều hướng ‹ › theo chế độ xem đang chọn. */
  const shift = (dir: -1 | 1) =>
    setCursor((c) => c.clone().add(dir, view === "day" ? "day" : view));

  const navBtn =
    "flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 [&_svg]:h-4 [&_svg]:w-4";

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-base font-semibold text-slate-800">Lịch nghỉ của tôi</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <button type="button" aria-label="Trước" onClick={() => shift(-1)} className={navBtn}>
              <ChevronLeftOutlined />
            </button>
            <button type="button" aria-label="Sau" onClick={() => shift(1)} className={navBtn}>
              <ChevronRightOutlined />
            </button>
          </div>
          <button
            type="button"
            onClick={() => setCursor(moment())}
            className="rounded-lg px-2 py-1 text-xs font-medium text-brand transition-colors hover:bg-sky-50"
          >
            Hôm nay
          </button>
          <div className="flex rounded-lg bg-slate-100 p-0.5">
            {VIEW_TABS.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setView(tab.key)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  view === tab.key
                    ? "bg-white text-brand shadow-sm"
                    : "text-slate-400 hover:text-slate-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {view === "month" && <MonthView cursor={cursor} entriesOn={entriesOn} isToday={isToday} />}
      {view === "week" && <WeekView cursor={cursor} entriesOn={entriesOn} isToday={isToday} />}
      {view === "day" && <DayView cursor={cursor} entriesOn={entriesOn} />}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400">
        {STATUS_PRIORITY.map((s) => (
          <span key={s} className="flex items-center gap-1.5">
            <span className={`h-2.5 w-2.5 rounded-full ${LEAVE_STATUS_META[s].dot}`} />
            {LEAVE_STATUS_META[s].label}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          Hôm nay
        </span>
      </div>
    </Card>
  );
};

/* ---------- View: Tháng ---------- */
interface ViewProps {
  cursor: moment.Moment;
  entriesOn: (d: moment.Moment) => LeaveRequestItem[];
  isToday: (d: moment.Moment) => boolean;
}

const MonthView = ({ cursor, entriesOn, isToday }: ViewProps) => {
  const year = cursor.year();
  const monthIndex = cursor.month();

  const cells = useMemo(() => {
    const firstDow = new Date(year, monthIndex, 1).getDay(); // 0=CN
    const lead = firstDow === 0 ? 6 : firstDow - 1; // Thứ 2 = cột đầu
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
    const arr: (number | null)[] = [];
    for (let i = 0; i < lead; i += 1) arr.push(null);
    for (let d = 1; d <= daysInMonth; d += 1) arr.push(d);
    return arr;
  }, [year, monthIndex]);

  const statusOf = (day: number): LeaveStatus | undefined => {
    const list = entriesOn(moment([year, monthIndex, day]));
    if (!list.length) return undefined;
    return [...list].sort(
      (a, b) => STATUS_PRIORITY.indexOf(a.status) - STATUS_PRIORITY.indexOf(b.status),
    )[0].status;
  };

  return (
    <>
      <p className="mb-2 text-lg font-bold text-slate-800">
        Tháng {monthIndex + 1}/{year}
      </p>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-slate-400">
        {WEEK_HEADERS.map((h) => (
          <div key={h} className="py-1">
            {h}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-[13px]">
        {cells.map((day, i) => {
          if (day === null) return <div key={`e${i}`} />;
          const status = statusOf(day);
          const todayCell = isToday(moment([year, monthIndex, day]));
          return (
            <div key={day} className="flex items-center justify-center py-0.5">
              <span
                className={[
                  "mx-auto flex aspect-square w-full max-w-9 items-center justify-center rounded-full",
                  todayCell
                    ? "bg-brand font-semibold text-white"
                    : status
                      ? DAY_FILL[status]
                      : "text-slate-600",
                ].join(" ")}
              >
                {day}
              </span>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- View: Tuần ---------- */
const WeekView = ({ cursor, entriesOn, isToday }: ViewProps) => {
  const start = cursor.clone().startOf("isoWeek"); // Thứ 2
  const days = Array.from({ length: 7 }, (_, i) => start.clone().add(i, "day"));
  const end = start.clone().add(6, "day");

  return (
    <>
      <p className="mb-2 text-lg font-bold text-slate-800">
        Tuần {start.format("DD/MM")} - {end.format("DD/MM/YYYY")}
      </p>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d, i) => {
          const entries = entriesOn(d);
          const todayCell = isToday(d);
          return (
            <div key={i} className="flex min-h-[104px] flex-col rounded-lg border border-slate-100 bg-slate-50/40 p-1">
              <div className="mb-1 text-center">
                <p className="text-[10px] font-medium text-slate-400">{WEEK_HEADERS[i]}</p>
                <span
                  className={`mx-auto mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs ${
                    todayCell ? "bg-brand font-semibold text-white" : "text-slate-600"
                  }`}
                >
                  {d.date()}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                {entries.map((it) => (
                  <span
                    key={it.id}
                    title={`${it.typeLabel} — ${LEAVE_STATUS_META[it.status].label}`}
                    className={`truncate rounded px-1.5 py-0.5 text-[10px] font-medium ${LEAVE_STATUS_META[it.status].badge}`}
                  >
                    {it.typeLabel}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
};

/* ---------- View: Ngày ---------- */
const DayView = ({
  cursor,
  entriesOn,
}: Omit<ViewProps, "isToday">) => {
  const entries = entriesOn(cursor);

  return (
    <>
      <p className="mb-3 text-lg font-bold text-slate-800">
        {VN_DOW[cursor.day()]}, {cursor.format("DD/MM/YYYY")}
      </p>
      {entries.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-200 py-10 text-center">
          <span className="text-slate-300">
            <CalendarDaysOutlined className="h-8 w-8" />
          </span>
          <p className="text-sm text-slate-400">Không có lịch nghỉ trong ngày này.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {entries.map((it) => {
            const meta = LEAVE_STATUS_META[it.status];
            return (
              <div
                key={it.id}
                className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
              >
                <IconBox
                  icon={<CalendarDaysOutlined />}
                  sizeClassName="h-10 w-10"
                  roundedClassName="rounded-xl"
                  colorClassName={meta.badge}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-slate-800">
                    {it.typeLabel}
                  </p>
                  <p className="truncate text-xs text-slate-500">
                    {moment(it.from).format("DD/MM")} - {moment(it.to).format("DD/MM/YYYY")} ({it.days} ngày)
                  </p>
                  <p className="truncate text-xs text-slate-400">{it.reason}</p>
                </div>
                <LeaveRequestStatus status={it.status} className="shrink-0" />
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

export default LeaveCalendarCard;
