import { useMemo, useState } from "react";
import moment from "moment";
import { observer } from "mobx-react-lite";
import { ArrowDownTrayOutlined, Button } from "tera-dls";

import { TimesheetService } from "@tera/modules/hr";

import CompactSelect from "_common/components/CompactSelect";
import DateRangeFilter, {
  type DateRangeValue,
} from "_common/components/DateRangeFilter";
import SearchInput from "_common/components/SearchInput";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useMeta } from "_common/hooks/useMeta";

import MonthCalendarCard from "./components/MonthCalendarCard";
import MonthlySummary from "./components/MonthlySummary";
import PerformanceCard from "./components/PerformanceCard";
import RecentActivityCard from "./components/RecentActivityCard";
import TeachingSessionTable from "./components/TeachingSessionTable";
import TimesheetStats from "./components/TimesheetStats";
import WeeklyHoursChart from "./components/WeeklyHoursChart";
import { exportTimesheetCsv } from "./_export";
import { groupHoursByWeek, toTimesheetSessions, toTimesheetSummary } from "./_utils";

const monthDefault = (): DateRangeValue => ({
  from: moment().startOf("month").toDate(),
  to: moment().endOf("month").toDate(),
});

const fmt = (d: Date) => moment(d).format("YYYY-MM-DD");

/** [053] Bảng công — buổi dạy đã điểm danh + thống kê của giáo viên đăng nhập
 * (`v1/hr/timesheet/*`, không có check-in/out riêng — xem quyết định 2026-07-17). */
const Timesheet = observer(() => {
  const { getOptions, getLabel } = useMeta();
  const [range, setRange] = useState<DateRangeValue>(monthDefault);
  const [classFilter, setClassFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  const dateParams = { date_from: fmt(range.from), date_to: fmt(range.to) };

  // Danh sách rộng (không phân trang server) dùng cho lịch tháng + biểu đồ tuần +
  // các card tổng hợp — cùng khoảng ngày với bảng, lọc/phân trang phần bảng ở client.
  const listParams: Record<string, unknown> = { ...dateParams, page: 1, per_page: 100 };
  const listQuery = TimesheetService.useTimesheetList({ params: listParams });
  const items = useMemo(() => toTimesheetSessions(listQuery.data), [listQuery.data]);

  const summaryQuery = TimesheetService.useTimesheetSummary(dateParams);
  const summary = useMemo(() => toTimesheetSummary(summaryQuery.data), [summaryQuery.data]);

  const classOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const it of items) {
      if (it.classId) seen.set(String(it.classId), it.className || `#${it.classId}`);
    }
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [items]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return items.filter((it) => {
      if (classFilter && String(it.classId) !== classFilter) return false;
      if (typeFilter && it.learningType !== typeFilter) return false;
      if (kw && !(it.className || "").toLowerCase().includes(kw)) return false;
      return true;
    });
  }, [items, classFilter, typeFilter, search]);

  const weekly = useMemo(() => groupHoursByWeek(filtered, range), [filtered, range]);

  const pagedRows = useMemo(
    () => filtered.slice((page - 1) * perPage, page * perPage),
    [filtered, page, perPage],
  );

  const resetToFirstPage = () => setPage(1);

  /** Lịch tháng đổi tháng → đặt khoảng ngày cả trang về [đầu tháng, cuối tháng]. */
  const goToMonth = (firstDay: Date) => {
    setRange({
      from: moment(firstDay).startOf("month").toDate(),
      to: moment(firstDay).endOf("month").toDate(),
    });
    resetToFirstPage();
  };

  const isLoading = listQuery.isLoading || summaryQuery.isLoading;

  return (
    <div className='p-4 xmd:p-6'>
      <div className='mb-4'>
        <h1 className='text-xl font-bold text-slate-800'>Bảng công</h1>
        <p className='mt-0.5 text-sm text-slate-400'>
          Theo dõi và tổng hợp buổi dạy của bạn.
        </p>
      </div>

      <div className='mb-4'>
        <TimesheetStats summary={summary} loading={summaryQuery.isLoading} />
      </div>

      <div className='mb-4 grid grid-cols-6 gap-2 xmd:flex xmd:items-center'>
        <div className='hidden xmd:contents'>
          <DateRangeFilter
            className='xmd:order-none xmd:max-w-[260px]!'
            value={range}
            onChange={(r) => {
              setRange(r);
              resetToFirstPage();
            }}
          />
        </div>
        <CompactSelect
          className='order-3 col-span-2 h-9 text-[13px] xmd:order-none xmd:shrink-0'
          value={classFilter}
          placeholder='Tất cả lớp học'
          allowClear
          options={classOptions}
          onChange={(v) => {
            setClassFilter(v);
            resetToFirstPage();
          }}
        />
        <CompactSelect
          className='order-5 col-span-2 h-9 text-[13px] xmd:order-none xmd:shrink-0'
          value={typeFilter}
          placeholder='Tất cả hình thức'
          allowClear
          options={getOptions("class_learning_type")}
          onChange={(v) => {
            setTypeFilter(v);
            resetToFirstPage();
          }}
        />
        <SearchInput
          wrapperClassName='order-1 col-span-5 xmd:order-none xmd:flex-1'
          className='bg-white!'
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            resetToFirstPage();
          }}
          placeholder='Tìm kiếm buổi dạy...'
        />
        <Button
          icon={<ArrowDownTrayOutlined />}
          onClick={() => exportTimesheetCsv(filtered, (v) => getLabel("class_learning_type", v))}
          disabled={filtered.length === 0}
          className='order-2 col-span-1 h-9! w-full justify-center! whitespace-nowrap bg-brand hover:bg-brand/80 xmd:order-none xmd:w-auto'
        >
          <span className='hidden xmd:inline'>Xuất file</span>
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_278px] [&>*]:min-w-0'>
        <div className='order-2 flex flex-col gap-4 lg:order-none'>
          <TeachingSessionTable
            rows={pagedRows}
            total={filtered.length}
            page={page}
            perPage={perPage}
            loading={isLoading}
            isError={listQuery.isError}
            onRetry={listQuery.refetch}
            onPageChange={(p, size) => {
              setPage(size !== perPage ? 1 : p);
              setPerPage(size);
            }}
          />
        </div>

        <div className='order-1 flex flex-col gap-4 lg:order-none'>
          <MonthCalendarCard
            items={items}
            month={range.from}
            onMonthChange={goToMonth}
          />
          <MonthlySummary
            items={filtered}
            month={range.from}
            loading={isLoading}
          />
        </div>
      </div>

      <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_278px] [&>*]:min-w-0'>
        <WeeklyHoursChart buckets={weekly} loading={isLoading} />
        <PerformanceCard summary={summary} />
        <RecentActivityCard />
      </div>
    </div>
  );
});

export default Timesheet;
