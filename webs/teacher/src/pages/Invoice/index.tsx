import { useMemo, useState } from "react";
import { useQueries } from "@tanstack/react-query";
import {
  BanknotesOutlined,
  Button,
  ChartBarOutlined,
  ClockOutlined,
  DocumentPlusOutlined,
  ReceiptRefundOutlined,
  WalletOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import DonutStatsCard from "_common/components/DonutStatsCard";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import StatusTabs from "_common/components/StatusTabs";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { StudentAPI } from "@tera/api";
import { ClassRoomService } from "@tera/modules/education";
import { InvoiceService } from "@tera/modules/finance";

import type { InvoiceRow, InvoiceTab } from "./_interface";
import { INVOICE_TAB_OPTIONS, PAYMENT_METHOD_COLORS, PAYMENT_METHOD_LABELS } from "./constants";
import { filterByTab, formatCurrency, summarizeInvoices, toInvoices } from "./_utils";
import InvoiceTable from "./components/InvoiceTable";
import InvoiceFilterSidebar from "./components/InvoiceFilterSidebar";

/** Invoice has no teacher/class link — scope to the teacher's own students by
 * resolving their classroom rosters, same fix as Students/StudentDetail. */
const Invoice = () => {
  const [filters, setFilters] = useUrlFilters(
    {
      tab: { type: "string", default: "all" as InvoiceTab },
      search: { type: "string", default: "" },
      status: { type: "string", default: "" },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );
  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const classesQuery = ClassRoomService.useClassRoomList({ params: { per_page: 50 } });
  const classes = useMemo(() => classesQuery.data?.data?.items ?? [], [classesQuery.data]);

  const rosterQueries = useQueries({
    queries: classes.map((c: any) => ({
      queryKey: ["invoices", "class-roster", c.id],
      queryFn: () => StudentAPI.getList({ params: { class_id: c.id, per_page: 100 } }),
      enabled: classes.length > 0,
    })),
  });
  const studentIds = useMemo(() => {
    const ids = new Set<number>();
    rosterQueries.forEach((q) => {
      ((q.data as any)?.data?.items ?? []).forEach((s: any) => ids.add(s.id));
    });
    return ids;
  }, [rosterQueries]);
  const rostersLoading = classesQuery.isLoading || rosterQueries.some((q) => q.isLoading);

  const invoiceQuery = InvoiceService.useInvoiceList({
    params: { page: 1, per_page: 200, sort_by: "invoice_date", sort_dir: "desc" },
  });
  const allInvoices = useMemo(() => toInvoices(invoiceQuery.data), [invoiceQuery.data]);
  const scopedInvoices = useMemo(
    () => allInvoices.filter((inv) => inv.studentId != null && studentIds.has(inv.studentId)),
    [allInvoices, studentIds],
  );

  const summary = useMemo(() => summarizeInvoices(scopedInvoices), [scopedInvoices]);

  const filteredInvoices = useMemo(() => {
    let list = filterByTab(scopedInvoices, filters.tab as InvoiceTab);
    if (filters.status) list = list.filter((i) => i.status === filters.status);
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (i) => i.code.toLowerCase().includes(q) || (i.studentName ?? "").toLowerCase().includes(q),
      );
    }
    return list;
  }, [scopedInvoices, filters.tab, filters.status, filters.search]);

  const total = filteredInvoices.length;
  const items = useMemo(
    () => filteredInvoices.slice((filters.page - 1) * filters.per_page, filters.page * filters.per_page),
    [filteredInvoices, filters.page, filters.per_page],
  );

  const isLoading = invoiceQuery.isLoading || rostersLoading;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== filters.per_page) setFilters({ per_page: nextSize, page: 1 });
    else setFilters({ page: nextPage });
  };

  const paymentMethodLegend = Object.entries(summary.byPaymentMethod).map(([key, value]) => ({
    key,
    label: PAYMENT_METHOD_LABELS[key] ?? key,
    color: PAYMENT_METHOD_COLORS[key] ?? PAYMENT_METHOD_COLORS.other,
    value,
    displayValue: formatCurrency(value),
  }));

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Hóa đơn</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý doanh thu, hóa đơn và thanh toán của học viên trong lớp bạn dạy.
          </p>
        </div>
        <Button
          icon={<DocumentPlusOutlined />}
          onClick={() => undefined}
          className="whitespace-nowrap bg-brand hover:bg-brand/80"
        >
          Tạo hóa đơn
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatisticCard
          icon={<ChartBarOutlined />}
          value={formatCurrency(summary.revenueThisMonth)}
          label="Doanh thu tháng này"
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<BanknotesOutlined />}
          value={formatCurrency(summary.totalRevenue)}
          label="Tổng doanh thu"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ClockOutlined />}
          value={formatCurrency(summary.pendingAmount)}
          label="Chờ thanh toán"
          sublabel={`${summary.pendingCount} hóa đơn`}
          iconClassName="bg-amber-50 text-amber-500"
          loading={isLoading}
        />
        <StatisticCard
          icon={<WalletOutlined />}
          value={formatCurrency(summary.paidAmount)}
          label="Đã thanh toán"
          sublabel={`${summary.paidCount} hóa đơn`}
          iconClassName="bg-sky-50 text-brand"
          loading={isLoading}
        />
        <StatisticCard
          icon={<ReceiptRefundOutlined />}
          value={formatCurrency(summary.refundedAmount)}
          label="Đã hoàn tiền"
          sublabel={`${summary.refundedCount} hóa đơn`}
          iconClassName="bg-violet-50 text-violet-500"
          loading={isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_300px]">
        <Card>
          <StatusTabs
            className="mb-3"
            tabs={INVOICE_TAB_OPTIONS}
            activeKey={filters.tab}
            onChange={(key) => setFilters({ tab: key as InvoiceTab, page: 1 })}
          />

          <div className="mb-3">
            <SearchInput
              value={searchDraft}
              onChange={(e) => setSearchDraft(e.target.value)}
              placeholder="Tìm kiếm hóa đơn, học viên..."
            />
          </div>

          <InvoiceTable items={items} loading={isLoading} onView={() => undefined} />

          <TablePagination
            total={total}
            page={filters.page}
            perPage={filters.per_page}
            unit="hóa đơn"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden flex-col gap-4 xl:flex">
          <InvoiceFilterSidebar
            draft={{ status: filters.status }}
            onChange={(patch) => setFilters({ ...patch, page: 1 })}
            onReset={() => setFilters({ status: "", page: 1 })}
          />

          <DonutStatsCard
            title="Phương thức thanh toán"
            centerValue={formatCurrency(summary.totalRevenue)}
            centerCaption="Tổng doanh thu"
            loading={isLoading}
            legend={paymentMethodLegend}
          />
        </div>
      </div>
    </div>
  );
};

export default Invoice;
