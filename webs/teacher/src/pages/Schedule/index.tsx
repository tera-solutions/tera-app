import { useEffect, useMemo, useState } from "react";
import moment from "moment";
import classNames from "classnames";
import {
  Button,
  CalendarDaysOutlined,
  Drawer,
  FunnelOutlined,
  Spin,
  XMarkOutlined,
} from "tera-dls";

import useIsMobile from "@tera/commons/hooks/useIsMobile";

import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import { useUrlFilters } from "_common/hooks/useUrlFilters";

import type { CalendarParams, ScheduleItem, ScheduleStatus, ScheduleView } from "./_interface";
import { DEFAULT_STATUSES } from "./constants";
import ScheduleToolbar from "./components/ScheduleToolbar";
import WeekCalendar from "./components/WeekCalendar";
import MonthCalendar from "./components/MonthCalendar";
import DayCalendar from "./components/DayCalendar";
import ListCalendar from "./components/ListCalendar";
import RangeView from "./components/RangeView";
import ScheduleDetailDrawer from "./components/ScheduleDetailDrawer";
import FilterSidebar from "./components/FilterSidebar";
import MonthStatsCard from "./components/MonthStatsCard";
import { TimetableService } from "@tera/modules/education";
import { toCalendarItems } from "_common/utils/schedule";
import { computeMonthStats } from "./_utils";

const Schedule = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<ScheduleView>("week");
  const [currentDate, setCurrentDate] = useState(() => moment());
  const [rangeFilter, setRangeFilter] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [scheduleFilters, setScheduleFilters] = useUrlFilters(
    {
      classId: { type: "number", default: undefined as number | undefined },
      branch: { type: "number", default: undefined as number | undefined },
      statuses: { type: "string[]", default: DEFAULT_STATUSES as string[] },
      dateFrom: { type: "string", default: undefined as string | undefined },
      dateTo: { type: "string", default: undefined as string | undefined },
    },
    { syncDefaultsOnMount: true },
  );
  const classId: number | "" =
    scheduleFilters.classId === undefined ? "" : scheduleFilters.classId;
  const branch: number | "" =
    scheduleFilters.branch === undefined ? "" : scheduleFilters.branch;
  const statuses = scheduleFilters.statuses as ScheduleStatus[];
  const setClassId = (value: number | "") =>
    setScheduleFilters({ classId: value === "" ? undefined : value });
  const setBranch = (value: number | "") =>
    setScheduleFilters({ branch: value === "" ? undefined : value });
  const setStatuses = (updater: (prev: ScheduleStatus[]) => ScheduleStatus[]) =>
    setScheduleFilters({ statuses: updater(statuses) });

  const effectiveView: ScheduleView = rangeFilter
    ? "range"
    : isMobile
      ? "week"
      : view;

  const viewRange = useMemo(() => {
    if (rangeFilter)
      return {
        date_from: rangeFilter[0].format("YYYY-MM-DD"),
        date_to: rangeFilter[1].format("YYYY-MM-DD"),
      };
    if (effectiveView === "month")
      return {
        date_from: currentDate.clone().startOf("month").format("YYYY-MM-DD"),
        date_to: currentDate.clone().endOf("month").format("YYYY-MM-DD"),
      };
    if (effectiveView === "day") {
      const d = currentDate.format("YYYY-MM-DD");
      return { date_from: d, date_to: d };
    }
    return {
      date_from: currentDate.clone().startOf("isoWeek").format("YYYY-MM-DD"),
      date_to: currentDate.clone().endOf("isoWeek").format("YYYY-MM-DD"),
    };
  }, [effectiveView, currentDate, rangeFilter]);

  // Keep the effective date window reflected in the URL, so "Lọc theo ngày"
  // shows a value from the first load onward, not only once a custom range
  // is picked.
  useEffect(() => {
    setScheduleFilters({
      dateFrom: viewRange.date_from,
      dateTo: viewRange.date_to,
    });
  }, [viewRange.date_from, viewRange.date_to, setScheduleFilters]);

  const monthRange = useMemo(
    () => ({
      date_from: currentDate.clone().startOf("month").format("YYYY-MM-DD"),
      date_to: currentDate.clone().endOf("month").format("YYYY-MM-DD"),
    }),
    [currentDate],
  );

  const filterParams: Pick<CalendarParams, "class_id" | "branch_id" | "status"> =
    useMemo(
      () => ({
        class_id: classId === "" ? undefined : classId,
        branch_id: branch === "" ? undefined : branch,
        status: statuses.join(","),
      }),
      [classId, branch, statuses],
    );

  const viewParams: CalendarParams = useMemo(
    () => ({
      date_from: viewRange.date_from,
      date_to: viewRange.date_to,
      ...filterParams,
    }),
    [viewRange, filterParams],
  );
  const monthParams: CalendarParams = useMemo(
    () => ({
      date_from: monthRange.date_from,
      date_to: monthRange.date_to,
      ...filterParams,
    }),
    [monthRange, filterParams],
  );

  const viewWithinMonth =
    viewRange.date_from >= monthRange.date_from &&
    viewRange.date_to <= monthRange.date_to;

  const monthQuery = TimetableService.useTimetableCalendar(monthParams);
  const isMonthLoading = monthQuery.isLoading;
  const monthData = useMemo(
    () => toCalendarItems(monthQuery.data?.data),
    [monthQuery.data],
  );

  const viewQuery = TimetableService.useTimetableCalendar(viewParams, {
    enabled: !viewWithinMonth,
  });
  const data = useMemo(
    () => toCalendarItems(viewQuery.data?.data),
    [viewQuery.data],
  );

  const isLoading = viewWithinMonth ? isMonthLoading : viewQuery.isLoading;
  const isError = viewWithinMonth ? monthQuery.isError : viewQuery.isError;
  const refetch = viewWithinMonth ? monthQuery.refetch : viewQuery.refetch;

  const monthSchedules = useMemo<ScheduleItem[]>(
    () => monthData ?? [],
    [monthData],
  );

  const viewSchedules = useMemo<ScheduleItem[]>(() => {
    if (!viewWithinMonth) return data ?? [];
    return monthSchedules.filter(
      (item) => item.date >= viewRange.date_from && item.date <= viewRange.date_to,
    );
  }, [viewWithinMonth, data, monthSchedules, viewRange]);

  const schedules = viewSchedules;

  const monthStats = useMemo(
    () => computeMonthStats(monthSchedules),
    [monthSchedules],
  );

  const step = (direction: 1 | -1) => {
    if (rangeFilter) {
      const span = rangeFilter[1].diff(rangeFilter[0], "days") + 1;
      const shift = direction * span;
      const next: [moment.Moment, moment.Moment] = [
        rangeFilter[0].clone().add(shift, "days"),
        rangeFilter[1].clone().add(shift, "days"),
      ];
      setRangeFilter(next);
      setCurrentDate(next[0].clone());
      return;
    }
    const unit =
      effectiveView === "month"
        ? "month"
        : effectiveView === "day"
          ? "day"
          : "week";
    setCurrentDate((prev) => prev.clone().add(direction, unit));
  };

  const handleSelectDay = (day: moment.Moment) => {
    setRangeFilter(null);
    setCurrentDate(day.clone());
    if (!isMobile && view === "month") setView("week");
  };

  const handleSelectView = (key: ScheduleView) => {
    setRangeFilter(null);
    setView(key);
  };

  const handleToday = () => {
    setRangeFilter(null);
    setCurrentDate(moment());
  };

  const handleStatusToggle = (status: ScheduleStatus) =>
    setStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status],
    );

  const handleResetFilters = () => {
    setScheduleFilters({
      classId: undefined,
      branch: undefined,
      statuses: DEFAULT_STATUSES,
    });
    setRangeFilter(null);
  };

  const cardTitle =
    effectiveView === "range"
      ? "Khoảng đã chọn"
      : effectiveView === "month"
        ? "Tháng hiện tại"
        : effectiveView === "day"
          ? "Ngày hiện tại"
          : effectiveView === "list"
            ? "Danh sách buổi học"
            : "Tuần hiện tại";

  const renderMainView = () => {
    if (effectiveView === "range")
      return (
        <RangeView
          schedules={schedules}
          onSelect={(item) => setSelectedId(item.id)}
        />
      );
    if (isMobile)
      return (
        <RangeView
          schedules={schedules}
          onSelect={(item) => setSelectedId(item.id)}
          emptyText="Không có lịch dạy trong tuần"
        />
      );
    if (effectiveView === "day")
      return (
        <DayCalendar
          currentDate={currentDate}
          schedules={schedules}
          onSelect={(item) => setSelectedId(item.id)}
        />
      );
    if (effectiveView === "list")
      return (
        <ListCalendar
          currentDate={currentDate}
          schedules={schedules}
          onSelect={(item) => setSelectedId(item.id)}
        />
      );
    if (effectiveView === "month")
      return (
        <MonthCalendar
          currentDate={currentDate}
          schedules={schedules}
          onSelect={(item) => setSelectedId(item.id)}
          onSelectDay={handleSelectDay}
        />
      );
    return (
      <WeekCalendar
        currentDate={currentDate}
        schedules={schedules}
        onSelect={(item) => setSelectedId(item.id)}
      />
    );
  };

  const filterProps = {
    classId,
    statuses,
    branch,
    range: (rangeFilter ?? [
      moment(viewRange.date_from, "YYYY-MM-DD"),
      moment(viewRange.date_to, "YYYY-MM-DD"),
    ]) as [moment.Moment, moment.Moment],
    onClassChange: setClassId,
    onStatusToggle: handleStatusToggle,
    onBranchChange: setBranch,
    onRangeChange: (value: [moment.Moment, moment.Moment]) => {
      setRangeFilter(value);
      setCurrentDate(value[0].clone());
    },
    onRangeClear: () => setRangeFilter(null),
    rangeActive: !!rangeFilter,
    onReset: handleResetFilters,
  };

  const hasActiveFilters =
    classId !== "" ||
    branch !== "" ||
    rangeFilter != null ||
    statuses.length !== DEFAULT_STATUSES.length;

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Lịch dạy</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý lịch dạy chi tiết theo tuần và tháng
          </p>
        </div>
      </div>

      <div className="mb-4">
        <ScheduleToolbar
          view={effectiveView}
          currentDate={currentDate}
          range={rangeFilter ?? undefined}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
          onToday={handleToday}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <div className="mb-3 flex items-center justify-between gap-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-slate-700 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:text-brand">
              <CalendarDaysOutlined />
              {cardTitle}
            </p>
            {!isMobile && (
              <div className="flex items-center gap-1 rounded-lg bg-slate-100 p-0.5">
                {(["list", "day", "week", "month"] as const).map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => handleSelectView(key)}
                    className={classNames(
                      "rounded-md px-4 py-1 text-sm font-medium transition-colors",
                      !rangeFilter && view === key
                        ? "bg-brand text-white shadow-sm"
                        : "text-slate-600 hover:text-slate-800",
                    )}
                  >
                    {key === "month"
                      ? "Tháng"
                      : key === "week"
                        ? "Tuần"
                        : key === "day"
                          ? "Ngày"
                          : "Danh sách"}
                  </button>
                ))}
              </div>
            )}
            {isMobile && (
              <Button
                type="alternative"
                icon={<FunnelOutlined />}
                onClick={() => setFilterOpen(true)}
                className="relative shrink-0"
              >
                Bộ lọc
                {hasActiveFilters && (
                  <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-brand" />
                )}
              </Button>
            )}
          </div>

          {isError ? (
            <div className="flex h-[40vh] items-center justify-center">
              <ErrorRetry
                onRetry={() => refetch()}
                message="Không tải được lịch dạy"
                iconClassName="h-7 w-7"
              />
            </div>
          ) : (
            <Spin spinning={isLoading}>{renderMainView()}</Spin>
          )}
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <FilterSidebar {...filterProps} />
          <MonthStatsCard
            total={monthStats.total}
            completed={monthStats.completed}
            loading={isMonthLoading}
          />
        </div>
      </div>

      <Drawer
        open={filterOpen}
        onClose={() => setFilterOpen(false)}
        placement="right"
        containerClassName="w-full max-w-[360px]"
      >
        <div className="flex h-full flex-col bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <h3 className="text-base font-semibold text-slate-800">Bộ lọc</h3>
            <button
              type="button"
              onClick={() => setFilterOpen(false)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 [&_svg]:h-5 [&_svg]:w-5"
            >
              <XMarkOutlined />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <FilterSidebar {...filterProps} />
          </div>
        </div>
      </Drawer>

      <ScheduleDetailDrawer
        scheduleId={selectedId}
        onClose={() => setSelectedId(null)}
      />
    </div>
  );
};

export default Schedule;
