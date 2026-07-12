import { useMemo, useState } from "react";
import moment from "moment";
import { observer } from "mobx-react-lite";
import { ArrowDownTrayOutlined, Button, notification } from "tera-dls";

import { TimetableService } from "@tera/modules/education";

import CompactSelect from "_common/components/CompactSelect";
import DateRangeFilter, {
  type DateRangeValue,
} from "_common/components/DateRangeFilter";
import SearchInput from "_common/components/SearchInput";
import { useMeta } from "_common/hooks/useMeta";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { toCalendarItems } from "_common/utils/schedule";

import HoursByTypeCard from "./components/HoursByTypeCard";
import MonthCalendarCard from "./components/MonthCalendarCard";
import MonthlySummary from "./components/MonthlySummary";
import PerformanceCard from "./components/PerformanceCard";
import RecentActivityCard from "./components/RecentActivityCard";
import TeachingSessionTable from "./components/TeachingSessionTable";
import TimesheetStats from "./components/TimesheetStats";
import WeeklyHoursChart from "./components/WeeklyHoursChart";
import { computeStats, groupMinutesByWeek } from "./_utils";

const monthDefault = (): DateRangeValue => ({
  from: moment().startOf("month").toDate(),
  to: moment().endOf("month").toDate(),
});

const fmt = (d: Date) => moment(d).format("YYYY-MM-DD");

/** [053] Bảng công — nhật ký buổi dạy + thống kê của giáo viên đăng nhập. */
const Timesheet = observer(() => {
  const { getLabel } = useMeta();

  const [range, setRange] = useState<DateRangeValue>(monthDefault);
  const [classFilter, setClassFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(DEFAULT_PAGE_SIZE);

  const query = TimetableService.useTimetableCalendar({
    date_from: fmt(range.from),
    date_to: fmt(range.to),
  });

  const items = useMemo(
    () => toCalendarItems((query.data as any)?.data),
    [query.data],
  );

  const classOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const it of items) {
      if (it.class_id)
        seen.set(String(it.class_id), it.class_name || `#${it.class_id}`);
    }
    return Array.from(seen, ([value, label]) => ({ value, label }));
  }, [items]);

  const statusOptions = useMemo(() => {
    const seen = new Set<string>();
    for (const it of items) if (it.status) seen.add(it.status);
    return Array.from(seen, (value) => ({
      value,
      label: getLabel("class_session_status", value) || value,
    }));
  }, [items, getLabel]);

  const filtered = useMemo(() => {
    const kw = search.trim().toLowerCase();
    return items.filter((it) => {
      if (classFilter && String(it.class_id) !== classFilter) return false;
      if (statusFilter && it.status !== statusFilter) return false;
      if (kw && !(it.class_name || "").toLowerCase().includes(kw)) return false;
      return true;
    });
  }, [items, classFilter, statusFilter, search]);

  const stats = useMemo(() => computeStats(filtered), [filtered]);
  const weekly = useMemo(
    () => groupMinutesByWeek(filtered, range),
    [filtered, range],
  );

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

  const notifySoon = () =>
    notification.warning({ message: "Tính năng đang được phát triển" });

  return (
    <div className='p-4 xmd:p-6'>
      <div className='mb-4'>
        <h1 className='text-xl font-bold text-slate-800'>Bảng công</h1>
        <p className='mt-0.5 text-sm text-slate-400'>
          Theo dõi và tổng hợp buổi dạy của bạn.
        </p>
      </div>

      <div className='mb-4'>
        <TimesheetStats stats={stats} loading={query.isLoading} />
      </div>

      {/* Hàng lọc. Mobile = grid 2 cột (order): search → lớp|trạng thái → hình thức → ngày → xuất.
          Desktop = flex 1 hàng: ngày → lớp → trạng thái → hình thức → search(flex-1) → Xuất Excel. */}
      <div className='mb-4 grid grid-cols-6 gap-2 xmd:flex xmd:items-center'>
        {/* Ẩn hẳn ở mobile — khoảng ngày do lịch tháng (MonthCalendarCard) điều khiển.
            Desktop: display:contents để RangePicker vẫn là flex-child trực tiếp (layout không đổi). */}
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
          className='order-4 col-span-2 h-9 text-[13px] xmd:order-none xmd:shrink-0'
          value={statusFilter}
          placeholder='Tất cả trạng thái'
          allowClear
          options={statusOptions}
          onChange={(v) => {
            setStatusFilter(v);
            resetToFirstPage();
          }}
        />
        {/* Hình thức chưa có dữ liệu (endpoint không trả learning_type) → disabled, chờ backend. */}
        <CompactSelect
          className='order-5 col-span-2 h-9 text-[13px] xmd:order-none xmd:shrink-0'
          value=''
          placeholder='Tất cả hình thức'
          options={[]}
          disabled
          onChange={() => undefined}
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
          onClick={notifySoon}
          className='order-2 col-span-1 h-9! w-full justify-center! whitespace-nowrap bg-brand hover:bg-brand/80 xmd:order-none xmd:w-auto'
        >
          <span className='hidden xmd:inline'>Xuất Excel</span>
        </Button>
      </div>

      <div className='grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_278px] [&>*]:min-w-0'>
        <div className='order-2 flex flex-col gap-4 lg:order-none'>
          <TeachingSessionTable
            rows={pagedRows}
            total={filtered.length}
            page={page}
            perPage={perPage}
            loading={query.isLoading}
            isError={query.isError}
            onRetry={query.refetch}
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
            stats={stats}
            month={range.from}
            loading={query.isLoading}
          />
          <HoursByTypeCard />
        </div>
      </div>

      <div className='mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)_278px] [&>*]:min-w-0'>
        <WeeklyHoursChart buckets={weekly} loading={query.isLoading} />
        <PerformanceCard stats={stats} />
        <RecentActivityCard />
      </div>
    </div>
  );
});

export default Timesheet;
