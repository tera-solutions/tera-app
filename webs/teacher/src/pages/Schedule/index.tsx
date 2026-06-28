import { useMemo, useState } from "react";
import moment from "moment";
import classNames from "classnames";
import {
  ArrowPathOutlined,
  Button,
  CalendarDaysOutlined,
  Drawer,
  ExclamationTriangleOutlined,
  FunnelOutlined,
  notification,
  PlusOutlined,
  Spin,
  XMarkOutlined,
} from "tera-dls";

import useIsMobile from "@tera/commons/hooks/useIsMobile";

import Card from "_common/components/Card";

import { useScheduleCalendar, useTeacherCounts } from "./hooks";
import type { CalendarParams } from "./_api";
import type { ScheduleItem, ScheduleStatus, ScheduleView } from "./_interface";
import { DEFAULT_STATUSES } from "./constants";
import ScheduleToolbar from "./components/ScheduleToolbar";
import WeekCalendar from "./components/WeekCalendar";
import MonthCalendar from "./components/MonthCalendar";
import DayView from "./components/DayView";
import RangeView from "./components/RangeView";
import ScheduleDetailDrawer from "./components/ScheduleDetailDrawer";
import FilterSidebar, {
  type FilterOption,
} from "./components/FilterSidebar";
import HomeroomCard from "./components/HomeroomCard";
import StudentCard from "./components/StudentCard";
import MonthStatsCard from "./components/MonthStatsCard";
import MiniCalendar from "./components/MiniCalendar";

const Schedule = () => {
  const isMobile = useIsMobile();
  const [view, setView] = useState<ScheduleView>("week");
  const [currentDate, setCurrentDate] = useState(() => moment());
  const [rangeFilter, setRangeFilter] = useState<
    [moment.Moment, moment.Moment] | null
  >(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [classId, setClassId] = useState<number | "">("");
  const [branch, setBranch] = useState<string | "">("");
  const [statuses, setStatuses] =
    useState<ScheduleStatus[]>(DEFAULT_STATUSES);

  // On mobile the week/month grids and filter sidebar are hidden, so the day
  // view would strand users on an empty single day. Show the week as a scrollable
  // agenda instead (paged by the toolbar).
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

  const monthRange = useMemo(
    () => ({
      date_from: currentDate.clone().startOf("month").format("YYYY-MM-DD"),
      date_to: currentDate.clone().endOf("month").format("YYYY-MM-DD"),
    }),
    [currentDate],
  );

  const viewParams: CalendarParams = useMemo(
    () => ({ date_from: viewRange.date_from, date_to: viewRange.date_to }),
    [viewRange],
  );
  const monthParams: CalendarParams = useMemo(
    () => ({ date_from: monthRange.date_from, date_to: monthRange.date_to }),
    [monthRange],
  );

  const { data, isLoading, isError, refetch } = useScheduleCalendar(viewParams);
  const { data: monthData, isLoading: isMonthLoading } =
    useScheduleCalendar(monthParams);
  const {
    totalClasses,
    totalStudents,
    classNames: homeroomNames,
    isClassesLoading,
    isStudentsLoading,
  } = useTeacherCounts();

  const viewSchedules = useMemo<ScheduleItem[]>(() => data ?? [], [data]);
  const monthSchedules = useMemo<ScheduleItem[]>(
    () => monthData ?? [],
    [monthData],
  );

  const schedules = useMemo<ScheduleItem[]>(() => {
    const keyword = search.trim().toLowerCase();
    return viewSchedules.filter((item) => {
      if (keyword && !item.class_name.toLowerCase().includes(keyword))
        return false;
      if (classId !== "" && item.class_id !== classId) return false;
      if (!statuses.includes(item.status)) return false;
      if (branch !== "" && item.branch !== branch) return false;
      return true;
    });
  }, [viewSchedules, search, classId, statuses, branch]);

  const classOptions = useMemo<FilterOption[]>(() => {
    const map = new Map<number, string>();
    monthSchedules.forEach((item) => {
      if (item.class_id && !map.has(item.class_id))
        map.set(item.class_id, item.class_name);
    });
    return Array.from(map, ([value, label]) => ({ value, label }));
  }, [monthSchedules]);

  const branchOptions = useMemo<FilterOption[]>(() => {
    const set = new Set<string>();
    monthSchedules.forEach((item) => item.branch && set.add(item.branch));
    return Array.from(set, (value) => ({ value, label: value }));
  }, [monthSchedules]);

  const monthStats = useMemo(() => {
    const total = monthSchedules.length;
    const completed = monthSchedules.filter(
      (item) => item.status === "done",
    ).length;
    return { total, completed };
  }, [monthSchedules]);

  const scheduleDates = useMemo(
    () => new Set(monthSchedules.map((item) => item.date)),
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

  const handleAdd = () =>
    notification.open({ message: "Tính năng đang được phát triển" });

  const cardTitle =
    effectiveView === "range"
      ? "Khoảng đã chọn"
      : effectiveView === "month"
        ? "Tháng hiện tại"
        : effectiveView === "day"
          ? "Ngày hiện tại"
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
        <DayView
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
    search,
    classId,
    statuses,
    branch,
    range: (rangeFilter ?? [
      moment(viewRange.date_from, "YYYY-MM-DD"),
      moment(viewRange.date_to, "YYYY-MM-DD"),
    ]) as [moment.Moment, moment.Moment],
    classOptions,
    branchOptions,
    onSearchChange: setSearch,
    onClassChange: setClassId,
    onStatusToggle: handleStatusToggle,
    onBranchChange: setBranch,
    onRangeChange: (value: [moment.Moment, moment.Moment]) => {
      setRangeFilter(value);
      setCurrentDate(value[0].clone());
    },
    onRangeClear: () => setRangeFilter(null),
    rangeActive: !!rangeFilter,
  };

  const hasActiveFilters =
    search.trim() !== "" ||
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
        <Button
          icon={<PlusOutlined />}
          onClick={handleAdd}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Thêm lịch dạy
        </Button>
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
                {(["week", "month"] as const).map((key) => (
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
                    {key === "week" ? "Tuần" : "Tháng"}
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
            <div className="flex h-[40vh] flex-col items-center justify-center gap-2 text-center">
              <ExclamationTriangleOutlined className="h-7 w-7 text-red-400" />
              <p className="text-sm text-slate-400">Không tải được lịch dạy</p>
              <button
                type="button"
                onClick={() => refetch()}
                className="flex items-center gap-1 rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-brand hover:bg-sky-100 [&_svg]:h-3.5 [&_svg]:w-3.5"
              >
                <ArrowPathOutlined />
                Thử lại
              </button>
            </div>
          ) : (
            <Spin spinning={isLoading}>{renderMainView()}</Spin>
          )}
        </Card>

        <div className="hidden xl:block">
          <FilterSidebar {...filterProps} />
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <HomeroomCard
          count={totalClasses}
          classNames={homeroomNames}
          loading={isClassesLoading}
        />
        <StudentCard count={totalStudents} loading={isStudentsLoading} />
        <MonthStatsCard
          total={monthStats.total}
          completed={monthStats.completed}
          loading={isMonthLoading}
        />
        <MiniCalendar
          currentDate={currentDate}
          scheduleDates={scheduleDates}
          loading={isMonthLoading}
          onSelectDay={handleSelectDay}
          onPrevMonth={() =>
            setCurrentDate((prev) => prev.clone().subtract(1, "month"))
          }
          onNextMonth={() =>
            setCurrentDate((prev) => prev.clone().add(1, "month"))
          }
        />
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
