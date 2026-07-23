import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronLeftOutlined, ChevronRightOutlined } from "tera-dls";

import { useStudentSchedule } from "_common/services/student/class.service";

const toKey = (year: number, month: number, day: number) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/** Lịch tháng thu nhỏ — mục 5.3 của task [087]. Tuần bắt đầu từ Thứ 2 như mockup. */
const MiniCalendar = () => {
  const { t } = useTranslation();
  const today = new Date();
  const [cursor, setCursor] = useState({
    year: today.getFullYear(),
    month: today.getMonth(),
  });

  const { data } = useStudentSchedule(cursor.year, cursor.month);
  const daysWithClass = useMemo(
    () => new Set(data?.days_with_class ?? []),
    [data],
  );

  const weekdays = t("classes.weekdays", { returnObjects: true }) as string[];

  const cells = useMemo(() => {
    const first = new Date(cursor.year, cursor.month, 1);
    // getDay(): CN=0 → đổi sang tuần bắt đầu Thứ 2
    const leading = (first.getDay() + 6) % 7;
    const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
    return [
      ...Array.from({ length: leading }, () => null),
      ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];
  }, [cursor]);

  const isCurrentMonth =
    cursor.year === today.getFullYear() && cursor.month === today.getMonth();

  const goToday = () =>
    setCursor({ year: today.getFullYear(), month: today.getMonth() });

  const move = (step: number) =>
    setCursor((prev) => {
      const next = new Date(prev.year, prev.month + step, 1);
      return { year: next.getFullYear(), month: next.getMonth() };
    });

  return (
    <section className="hana-card p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-lg font-bold text-hana-navy">
          {t("classes.calendar_title")}
        </h2>
        {/* Chỉ hiện khi đang xem tháng khác — bấm < > xong có lối quay về ngay */}
        {!isCurrentMonth && (
          <button
            type="button"
            onClick={goToday}
            title={t("classes.go_today_tooltip")}
            className="shrink-0 cursor-pointer rounded-full border border-hana-navy/20 px-3 py-1 text-sm font-semibold text-hana-blue transition hover:border-hana-navy/40 hover:bg-hana-blue-soft"
          >
            {t("classes.go_today")}
          </button>
        )}
      </div>

      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          title={t("classes.prev_month")}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-hana-navy/20 text-hana-navy/70 transition hover:border-hana-navy/40 hover:bg-hana-blue-soft hover:text-hana-blue"
        >
          <ChevronLeftOutlined className="h-4 w-4" />
        </button>
        <span className="text-base font-semibold text-hana-navy">
          {t("classes.month_label", {
            month: cursor.month + 1,
            year: cursor.year,
          })}
        </span>
        <button
          type="button"
          onClick={() => move(1)}
          title={t("classes.next_month")}
          className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-hana-navy/20 text-hana-navy/70 transition hover:border-hana-navy/40 hover:bg-hana-blue-soft hover:text-hana-blue"
        >
          <ChevronRightOutlined className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center">
        {weekdays.map((label) => (
          <span
            key={label}
            className="py-1 text-xs font-semibold text-hana-muted"
          >
            {label}
          </span>
        ))}

        {cells.map((day, index) => {
          if (!day) return <span key={`empty-${index}`} />;

          const key = toKey(cursor.year, cursor.month, day);
          const isToday =
            day === today.getDate() &&
            cursor.month === today.getMonth() &&
            cursor.year === today.getFullYear();
          const hasClass = daysWithClass.has(key);

          return (
            <span
              key={key}
              className={`mx-auto flex h-8 w-8 items-center justify-center rounded-full text-sm transition ${
                isToday
                  ? "bg-hana-blue font-bold text-white"
                  : hasClass
                    ? "bg-hana-blue-soft font-semibold text-hana-blue"
                    : "text-hana-navy"
              }`}
            >
              {day}
            </span>
          );
        })}
      </div>
    </section>
  );
};

export default MiniCalendar;
