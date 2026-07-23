import { useMemo, useState } from "react";
import moment from "moment";
import { observer } from "mobx-react-lite";
import { AcademicCapOutlined, ArrowDownTrayOutlined, Button, EyeOutlined } from "tera-dls";

import { PayrollService, TimesheetService } from "@tera/modules/hr";

import Badge from "_common/components/Badge";
import CalendarCard, { type CalendarCardEvent } from "_common/components/CalendarCard";
import CompactSelect from "_common/components/CompactSelect";
import DateRangeFilter, {
  type DateRangeValue,
} from "_common/components/DateRangeFilter";
import IconBox from "_common/components/IconBox";
import SearchInput from "_common/components/SearchInput";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useMeta } from "_common/hooks/useMeta";
import { toPayrollRows } from "pages/Payroll/_utils";
import ScheduleDetailDrawer from "pages/Schedule/components/ScheduleDetailDrawer";

import MonthlySummary from "./components/MonthlySummary";
import PerformanceCard from "./components/PerformanceCard";
import RecentActivityCard from "./components/RecentActivityCard";
import TeachingSessionTable from "./components/TeachingSessionTable";
import TimesheetStats from "./components/TimesheetStats";
import WeeklyHoursChart from "./components/WeeklyHoursChart";
import type { TimesheetSessionRow } from "./_interface";
import { exportTimesheetCsv } from "./_export";
import {
  formatDuration,
  groupHoursByWeek,
  toTimesheetCalendarCardEvents,
  toTimesheetSessions,
  toTimesheetSummary,
} from "./_utils";

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
  const [openId, setOpenId] = useState<number | null>(null);

  const dateParams = { date_from: fmt(range.from), date_to: fmt(range.to) };

  // Danh sách rộng (không phân trang server) dùng cho biểu đồ tuần + các card tổng
  // hợp — cùng khoảng ngày với bảng, lọc/phân trang phần bảng ở client.
  const listParams: Record<string, unknown> = { ...dateParams, page: 1, per_page: 100 };
  const listQuery = TimesheetService.useTimesheetList({ params: listParams });
  const items = useMemo(() => toTimesheetSessions(listQuery.data), [listQuery.data]);

  // "Lịch dạy của tôi" — độc lập với bộ lọc ngày của bảng (giống `overviewQuery` ở
  // `/leave-requests`), để có thể lật xem tháng khác trong lịch mà không phụ
  // thuộc khoảng ngày đang lọc.
  const calendarQuery = TimesheetService.useTimesheetList({ params: { page: 1, per_page: 100 } });
  const calendarItems = useMemo(() => toTimesheetSessions(calendarQuery.data), [calendarQuery.data]);
  const calendarEvents = useMemo(() => toTimesheetCalendarCardEvents(calendarItems), [calendarItems]);

  const summaryQuery = TimesheetService.useTimesheetSummary(dateParams);
  const summary = useMemo(() => toTimesheetSummary(summaryQuery.data), [summaryQuery.data]);

  // "Thu nhập ước tính" — lấy từ kỳ lương (BE tự backfill khi gọi list()) khớp
  // tháng/năm đang xem trên Bảng công; chỉ có ý nghĩa khi khoảng ngày = 1 tháng trọn vẹn.
  const payrollQuery = PayrollService.usePayrollList({ params: { page: 1, per_page: 100 } });
  const payrollRows = useMemo(() => toPayrollRows(payrollQuery.data), [payrollQuery.data]);
  const isFullMonthRange =
    moment(range.from).isSame(moment(range.from).startOf("month"), "day") &&
    moment(range.to).isSame(moment(range.from).endOf("month"), "day");
  const estimatedIncome = isFullMonthRange
    ? (payrollRows.find(
        (p) => p.month === range.from.getMonth() + 1 && p.year === range.from.getFullYear(),
      )?.totalSalary ?? null)
    : null;

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
        <TimesheetStats
          summary={summary}
          loading={summaryQuery.isLoading}
          estimatedIncome={estimatedIncome}
          incomeLoading={payrollQuery.isLoading}
        />
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

      <div className='grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] [&>*]:min-w-0'>
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

        <CalendarCard
          title='Lịch dạy của tôi'
          events={calendarEvents}
          legend={[{ label: 'Mỗi màu tương ứng một lớp học', color: '#94a3b8' }]}
          emptyDayText='Không có buổi dạy trong ngày này.'
          onEventClick={(event) => setOpenId(event.item.id)}
          renderDayEntry={(event: CalendarCardEvent<TimesheetSessionRow>) => {
            const it = event.item;
            return (
              <div key={it.id} className='flex items-center gap-3 rounded-xl border border-slate-100 p-3'>
                <IconBox
                  icon={<AcademicCapOutlined />}
                  sizeClassName='h-10 w-10'
                  roundedClassName='rounded-xl'
                  style={{ color: event.color, backgroundColor: event.backgroundColor }}
                />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-sm font-semibold text-slate-800'>{it.className || '—'}</p>
                  <p className='truncate text-xs text-slate-500'>
                    {it.startTime?.slice(0, 5)} - {it.endTime?.slice(0, 5)} · {formatDuration(it.hours)}
                  </p>
                  <p className='truncate text-xs text-slate-400'>
                    {it.presentCount}/{it.attendancesCount} có mặt
                  </p>
                </div>
                <div className='flex shrink-0 items-center gap-2'>
                  <Badge className='whitespace-nowrap bg-emerald-50 px-2.5 py-0.5 text-[11px] text-emerald-600'>
                    Đã điểm danh
                  </Badge>
                  <button
                    type='button'
                    onClick={() => setOpenId(it.id)}
                    aria-label='Xem chi tiết'
                    className='flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-sky-50 hover:text-brand [&_svg]:h-4 [&_svg]:w-4'
                  >
                    <EyeOutlined />
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>

      <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)] [&>*]:min-w-0'>
        <WeeklyHoursChart buckets={weekly} loading={isLoading} />
        <MonthlySummary items={filtered} month={range.from} loading={isLoading} />
        <PerformanceCard summary={summary} />
        <RecentActivityCard />
      </div>

      <ScheduleDetailDrawer scheduleId={openId} onClose={() => setOpenId(null)} />
    </div>
  );
});

export default Timesheet;
