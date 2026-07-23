import { useEffect, useRef, useState } from "react";
import moment from "moment";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import type { EventClickArg } from "@fullcalendar/core";
import { CalendarDaysOutlined, ChevronLeftOutlined, ChevronRightOutlined } from "tera-dls";

import Card from "_common/components/Card";
import { WEEKDAY_LABELS } from "pages/Schedule/constants";

import "pages/Schedule/components/fc-overrides.css";

export interface CalendarCardEvent<T = unknown> {
  id: string | number;
  /** "YYYY-MM-DD" hoặc ISO — ngày hiển thị trên lịch (all-day). */
  date: string;
  title: string;
  color: string;
  backgroundColor: string;
  item: T;
}

export interface CalendarCardLegendItem {
  label: string;
  color: string;
}

type ViewMode = "month" | "week" | "day";

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

interface CalendarCardProps<T> {
  title: string;
  events: CalendarCardEvent<T>[];
  legend: CalendarCardLegendItem[];
  emptyDayText: string;
  /** Dòng agenda cho view "Ngày" — mỗi trang tự render chi tiết theo domain riêng. */
  renderDayEntry: (event: CalendarCardEvent<T>) => React.ReactNode;
  onEventClick?: (event: CalendarCardEvent<T>) => void;
}

/** Lịch Tháng/Tuần/Ngày dùng chung giữa `/timesheet` và `/leave-requests` — cùng
 * UI, cùng kích thước (FullCalendar month=480px, week=160px). Tháng/Tuần render
 * lưới sự kiện màu theo `event.color`/`backgroundColor`; Ngày render agenda qua
 * `renderDayEntry` vì nội dung chi tiết khác nhau giữa 2 trang. */
const CalendarCard = <T,>({
  title,
  events,
  legend,
  emptyDayText,
  renderDayEntry,
  onEventClick,
}: CalendarCardProps<T>) => {
  const [view, setView] = useState<ViewMode>("month");
  // Con trỏ thời gian: tháng (month view) / tuần chứa nó (week) / đúng ngày (day).
  const [cursor, setCursor] = useState(() => moment());

  /** Điều hướng ‹ › theo chế độ xem đang chọn. */
  const shift = (dir: -1 | 1) =>
    setCursor((c) => c.clone().add(dir, view === "day" ? "day" : view));

  const navBtn =
    "flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 [&_svg]:h-4 [&_svg]:w-4";

  return (
    <Card className="xmd:p-5" animated={false}>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <p className="flex items-center gap-2 text-base font-semibold text-slate-800 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand">
          <CalendarDaysOutlined />
          {title}
        </p>
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

      {(view === "month" || view === "week") && (
        <GridView view={view} cursor={cursor} events={events} onEventClick={onEventClick} />
      )}
      {view === "day" && (
        <DayView cursor={cursor} events={events} emptyDayText={emptyDayText} renderDayEntry={renderDayEntry} />
      )}

      <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] text-slate-400">
        {legend.map((l) => (
          <span key={l.label} className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
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

/* ---------- View: Tháng / Tuần (FullCalendar) ---------- */
interface GridViewProps<T> {
  view: "month" | "week";
  cursor: moment.Moment;
  events: CalendarCardEvent<T>[];
  onEventClick?: (event: CalendarCardEvent<T>) => void;
}

const GridView = <T,>({ view, cursor, events, onEventClick }: GridViewProps<T>) => {
  const calendarRef = useRef<FullCalendar>(null);
  const fcView = view === "month" ? "dayGridMonth" : "dayGridWeek";

  const fcEvents = events.map((e) => ({
    id: String(e.id),
    title: e.title,
    start: e.date,
    allDay: true,
    extendedProps: { event: e },
  }));

  useEffect(() => {
    const api = calendarRef.current?.getApi();
    if (!api) return;
    if (api.view.type !== fcView) api.changeView(fcView);
    api.gotoDate(cursor.toDate());
  }, [cursor, fcView]);

  return (
    <>
      <p className="mb-2 text-lg font-bold text-slate-800">
        {view === "month"
          ? `Tháng ${cursor.month() + 1}/${cursor.year()}`
          : `Tuần ${cursor.clone().startOf("isoWeek").format("DD/MM")} - ${cursor.clone().endOf("isoWeek").format("DD/MM/YYYY")}`}
      </p>
      <div className="fc-tera">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin]}
          initialView={fcView}
          initialDate={cursor.toDate()}
          headerToolbar={false}
          firstDay={1}
          height={view === "month" ? 480 : 160}
          events={fcEvents}
          dayMaxEvents={view === "month" ? 3 : false}
          dayHeaderContent={({ date }: { date: Date }) => (
            <span className="text-xs font-medium text-slate-600">
              {WEEKDAY_LABELS[(date.getDay() + 6) % 7]}
            </span>
          )}
          eventClick={(arg: EventClickArg) =>
            onEventClick?.((arg.event.extendedProps as { event: CalendarCardEvent<T> }).event)
          }
          eventContent={({ event }: { event: { extendedProps: { event: CalendarCardEvent<T> } } }) => {
            const e = event.extendedProps.event;
            return (
              <button
                type="button"
                onClick={() => onEventClick?.(e)}
                className="flex w-full items-center gap-1 truncate rounded px-1.5 py-0.5 text-left text-[11px] font-medium"
                style={{ color: e.color, backgroundColor: e.backgroundColor }}
                title={e.title}
              >
                <span className="truncate">{e.title}</span>
              </button>
            );
          }}
        />
      </div>
    </>
  );
};

/* ---------- View: Ngày (agenda) ---------- */
interface DayViewProps<T> {
  cursor: moment.Moment;
  events: CalendarCardEvent<T>[];
  emptyDayText: string;
  renderDayEntry: (event: CalendarCardEvent<T>) => React.ReactNode;
}

const DayView = <T,>({ cursor, events, emptyDayText, renderDayEntry }: DayViewProps<T>) => {
  const entries = events.filter((e) => cursor.isSame(moment(e.date), "day"));

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
          <p className="text-sm text-slate-400">{emptyDayText}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">{entries.map((e) => renderDayEntry(e))}</div>
      )}
    </>
  );
};

export default CalendarCard;
