/* Import: library */
import { useMemo, useState } from "react";
import { observer } from "mobx-react";
import { useTranslation } from "react-i18next";
import { ChevronLeftOutlined, ChevronRightOutlined } from "tera-dls";

/* Import: packages */
import { useStores } from "@tera/stores/useStores";

/* Import: pages */
import { IClassSession } from "pages/education/class-room/_interface";

type Mode = "month" | "week" | "day";

const pad = (n: number) => String(n).padStart(2, "0");
const ymd = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const hhmm = (v?: string) => (v ? String(v).slice(0, 5) : "");
const sameDay = (a: Date, b: Date) => ymd(a) === ymd(b);
// Thứ 2 = 0 ... Chủ nhật = 6
const monIdx = (d: Date) => (d.getDay() + 6) % 7;
const WEEKDAYS = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];

const ClassSessionCalendar = observer(
  ({
    sessions,
    onSelect,
  }: {
    sessions: IClassSession[];
    onSelect: (s: IClassSession) => void;
  }) => {
    const { t } = useTranslation();
    const { globalStore } = useStores();
    const [mode, setMode] = useState<Mode>("month");
    const [anchor, setAnchor] = useState(new Date());

    // Gom buổi học theo ngày (YYYY-MM-DD), sort theo giờ bắt đầu
    const byDate = useMemo(() => {
      const m = new Map<string, IClassSession[]>();
      sessions.forEach((s) => {
        if (!s.session_date) return;
        const key = String(s.session_date).slice(0, 10);
        if (!m.has(key)) m.set(key, []);
        m.get(key)!.push(s);
      });
      m.forEach((arr) =>
        arr.sort((a, b) =>
          String(a.start_time ?? "").localeCompare(String(b.start_time ?? "")),
        ),
      );
      return m;
    }, [sessions]);

    const chipStyle = (s: IClassSession) => {
      const item = globalStore.getMetaItem("class_session_status", s.status);
      return {
        color: item?.color ?? "#374151",
        backgroundColor: item?.backgroundColor ?? "#f3f4f6",
      };
    };

    const Chip = ({ s, showTime = true }: { s: IClassSession; showTime?: boolean }) => (
      <button
        type="button"
        onClick={() => onSelect(s)}
        title={s.name}
        className="block w-full text-left text-[11px] leading-tight px-1 py-0.5 rounded mb-0.5 truncate hover:opacity-80"
        style={chipStyle(s)}
      >
        {showTime && hhmm(s.start_time) ? `${hhmm(s.start_time)} ` : ""}
        {s.name ?? s.code ?? "—"}
      </button>
    );

    const shift = (dir: number) => {
      const d = new Date(anchor);
      if (mode === "month") d.setMonth(d.getMonth() + dir);
      else if (mode === "week") d.setDate(d.getDate() + dir * 7);
      else d.setDate(d.getDate() + dir);
      setAnchor(d);
    };

    const today = new Date();

    // Nhãn tiêu đề theo mode
    const headerLabel = () => {
      if (mode === "day")
        return anchor.toLocaleDateString("vi-VN", {
          weekday: "long",
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
      if (mode === "week") {
        const start = new Date(anchor);
        start.setDate(start.getDate() - monIdx(start));
        const end = new Date(start);
        end.setDate(end.getDate() + 6);
        return `${start.toLocaleDateString("vi-VN")} - ${end.toLocaleDateString("vi-VN")}`;
      }
      return anchor.toLocaleDateString("vi-VN", {
        month: "long",
        year: "numeric",
      });
    };

    // ----- Month grid -----
    const renderMonth = () => {
      const first = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
      const gridStart = new Date(first);
      gridStart.setDate(first.getDate() - monIdx(first));
      const cells: Date[] = [];
      for (let i = 0; i < 42; i++) {
        const d = new Date(gridStart);
        d.setDate(gridStart.getDate() + i);
        cells.push(d);
      }
      return (
        <div>
          <div className="grid grid-cols-7 text-center text-[12px] font-medium text-gray-500 mb-1">
            {WEEKDAYS.map((w) => (
              <div key={w} className="py-1">
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              const inMonth = d.getMonth() === anchor.getMonth();
              const list = byDate.get(ymd(d)) ?? [];
              const isToday = sameDay(d, today);
              return (
                <div
                  key={i}
                  className={`min-h-[78px] rounded-md border p-1 ${
                    inMonth ? "bg-white border-gray-100" : "bg-gray-50 border-gray-100"
                  }`}
                >
                  <div
                    className={`text-[12px] mb-0.5 ${
                      isToday
                        ? "inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white"
                        : inMonth
                          ? "text-gray-700"
                          : "text-gray-300"
                    }`}
                  >
                    {d.getDate()}
                  </div>
                  {list.slice(0, 3).map((s, j) => (
                    <Chip key={s.id ?? j} s={s} />
                  ))}
                  {list.length > 3 && (
                    <span className="text-[11px] text-gray-400">
                      +{list.length - 3}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    };

    // ----- Week grid -----
    const renderWeek = () => {
      const start = new Date(anchor);
      start.setDate(start.getDate() - monIdx(start));
      const days: Date[] = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(start);
        d.setDate(start.getDate() + i);
        days.push(d);
      }
      return (
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const list = byDate.get(ymd(d)) ?? [];
            const isToday = sameDay(d, today);
            return (
              <div
                key={i}
                className="min-h-[160px] rounded-md border border-gray-100 bg-white p-1"
              >
                <div className="text-center text-[12px] mb-1">
                  <div className="text-gray-500">{WEEKDAYS[i]}</div>
                  <div
                    className={
                      isToday
                        ? "inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white"
                        : "text-gray-700"
                    }
                  >
                    {d.getDate()}
                  </div>
                </div>
                {list.length === 0 ? (
                  <p className="text-[11px] text-gray-300 text-center mt-2">—</p>
                ) : (
                  list.map((s, j) => <Chip key={s.id ?? j} s={s} />)
                )}
              </div>
            );
          })}
        </div>
      );
    };

    // ----- Day list -----
    const renderDay = () => {
      const list = byDate.get(ymd(anchor)) ?? [];
      if (list.length === 0)
        return (
          <p className="text-[13px] text-gray-400 italic py-6 text-center">
            {t("classroom.cal_no_session")}
          </p>
        );
      return (
        <div className="flex flex-col gap-1.5">
          {list.map((s, j) => (
            <button
              type="button"
              key={s.id ?? j}
              onClick={() => onSelect(s)}
              className="flex items-center gap-3 rounded-md border border-gray-100 bg-white px-3 py-2 text-left hover:bg-gray-50"
            >
              <span className="text-[13px] font-medium text-gray-700 w-28 shrink-0">
                {hhmm(s.start_time)} - {hhmm(s.end_time)}
              </span>
              <span className="text-[13px] text-gray-800 flex-1 truncate">
                {s.name ?? s.code ?? "—"}
              </span>
              <span
                className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0"
                style={chipStyle(s)}
              >
                {globalStore.getMetaLabel("class_session_status", s.status) ??
                  s.status}
              </span>
            </button>
          ))}
        </div>
      );
    };

    const modeBtn = (m: Mode, label: string) => (
      <button
        type="button"
        onClick={() => setMode(m)}
        className={`px-3 py-1 text-[12px] font-medium rounded-md ${
          mode === m
            ? "bg-blue-500 text-white"
            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
        }`}
      >
        {label}
      </button>
    );

    return (
      <div>
        {/* Calendar toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => shift(-1)}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <ChevronLeftOutlined className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setAnchor(new Date())}
              className="px-2.5 py-1 text-[12px] rounded-md border border-gray-200 hover:bg-gray-50"
            >
              {t("classroom.cal_today")}
            </button>
            <button
              type="button"
              onClick={() => shift(1)}
              className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
            >
              <ChevronRightOutlined className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-semibold text-gray-800 capitalize ml-1">
              {headerLabel()}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {modeBtn("month", t("classroom.cal_month"))}
            {modeBtn("week", t("classroom.cal_week"))}
            {modeBtn("day", t("classroom.cal_day"))}
          </div>
        </div>

        {mode === "month" && renderMonth()}
        {mode === "week" && renderWeek()}
        {mode === "day" && renderDay()}
      </div>
    );
  },
);

export default ClassSessionCalendar;
