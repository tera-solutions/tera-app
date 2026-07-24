import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowTrendingUpOutlined,
  Button,
  CalendarDaysOutlined,
  CheckBadgeOutlined,
  notification,
  PlusOutlined,
  UserPlusOutlined,
  UsersOutlined,
} from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import TablePagination from "_common/components/TablePagination";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { LeadService } from "@tera/modules/crm";

import type { LeadRow } from "./_interface";
import { toLeadRows, toLeadSummary } from "./_utils";
import LeadTable from "./components/LeadTable";
import LeadFilterSidebar from "./components/LeadFilterSidebar";
import LeadForm from "./components/LeadForm";

const Leads = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<LeadRow | null>(null);

  const { mutate: suspendLead } = LeadService.useLeadSuspend();

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      status: { type: "string", default: "" },
      source: { type: "string", default: "" },
      owner_id: { type: "string", default: "" },
      date_from: { type: "string", default: "" },
      date_to: { type: "string", default: "" },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  // Unfiltered, capped sample purely to drive the stat cards — same
  // approximation `pages/Parents` uses, since there's no dedicated summary
  // endpoint.
  const summaryQuery = LeadService.useLeadList({ params: { per_page: 200 } });
  const summary = useMemo(
    () => toLeadSummary(toLeadRows(summaryQuery.data?.data?.items)),
    [summaryQuery.data],
  );

  const listQuery = LeadService.useLeadList({
    params: {
      search: filters.search || undefined,
      page: filters.page,
      per_page: filters.per_page,
      filters: {
        status: filters.status || undefined,
        source: filters.source || undefined,
        owner_id: filters.owner_id || undefined,
        contacted_from: filters.date_from || undefined,
        contacted_to: filters.date_to || undefined,
      },
    },
  });
  const rows = useMemo(() => toLeadRows(listQuery.data?.data?.items), [listQuery.data]);
  const total = listQuery.data?.data?.pagination?.total ?? 0;

  const handleChangePage = (nextPage: number, nextSize: number) => {
    if (nextSize !== filters.per_page) {
      setFilters({ per_page: nextSize, page: 1 });
    } else {
      setFilters({ page: nextPage });
    }
  };

  const handleView = (lead: LeadRow) => navigate(`${PATHS.leadDetail}/${lead.id}`);

  const handleCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const handleEdit = (lead: LeadRow) => {
    setEditing(lead);
    setFormOpen(true);
  };
  const handleDelete = (lead: LeadRow) =>
    confirm.warning({
      title: "Ngừng theo dõi lead",
      content: `Ngừng theo dõi lead "${lead.name}"? Bạn có thể khôi phục lại sau.`,
      onOk: () =>
        suspendLead(
          { id: lead.id, params: { reason: "Ngừng theo dõi từ danh sách lead" } },
          {
            onSuccess: () => notification.success({ message: "Đã ngừng theo dõi lead" }),
            onError: (error: any) =>
              notification.error({ message: error?.data?.msg ?? "Không thể ngừng theo dõi lead" }),
          },
        ),
    });

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Khách hàng tiềm năng</h1>
          <p className="mt-0.5 text-sm text-slate-400">Quản lý khách hàng tiềm năng</p>
        </div>
        <Button icon={<PlusOutlined />} onClick={handleCreate}>
          Thêm lead
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-5">
        <StatisticCard
          icon={<UsersOutlined />}
          value={summary.total}
          label="Tổng lead"
          iconClassName="bg-sky-50 text-brand"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<UserPlusOutlined />}
          value={summary.pending}
          label="Mới"
          iconClassName="bg-blue-50 text-blue-600"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<ArrowTrendingUpOutlined />}
          value={summary.verified}
          label="Đang chăm sóc"
          iconClassName="bg-amber-50 text-amber-600"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<CalendarDaysOutlined />}
          value={summary.consulting}
          label="Đã hẹn tư vấn"
          iconClassName="bg-rose-50 text-rose-500"
          loading={summaryQuery.isLoading}
        />
        <StatisticCard
          icon={<CheckBadgeOutlined />}
          value={summary.studying}
          label="Đã ghi danh"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={summaryQuery.isLoading}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_280px]">
        <Card>
          <SearchInput
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm theo tên, SĐT..."
            wrapperClassName="mb-3"
          />
          <LeadTable
            items={rows}
            loading={listQuery.isLoading}
            isError={listQuery.isError}
            onRetry={() => listQuery.refetch()}
            onView={handleView}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
          <TablePagination
            total={total}
            page={filters.page}
            perPage={filters.per_page}
            unit="lead"
            onChange={handleChangePage}
          />
        </Card>

        <div className="hidden xl:block">
          <LeadFilterSidebar
            status={filters.status}
            source={filters.source}
            ownerId={filters.owner_id}
            dateFrom={filters.date_from}
            dateTo={filters.date_to}
            onChange={(patch) => {
              const next: Partial<typeof filters> = { page: 1 };
              if ("status" in patch) next.status = patch.status;
              if ("source" in patch) next.source = patch.source;
              if ("ownerId" in patch) next.owner_id = patch.ownerId;
              if ("dateFrom" in patch) next.date_from = patch.dateFrom;
              if ("dateTo" in patch) next.date_to = patch.dateTo;
              setFilters(next);
            }}
            onReset={() =>
              setFilters({
                search: "",
                status: "",
                source: "",
                owner_id: "",
                date_from: "",
                date_to: "",
                page: 1,
              })
            }
          />
        </div>
      </div>

      <LeadForm open={formOpen} onClose={() => setFormOpen(false)} lead={editing} />
    </div>
  );
};

export default Leads;
