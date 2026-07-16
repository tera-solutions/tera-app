import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Button, notification } from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { SuperadminService } from "@tera/modules/system";

import { listItems, listTotal, TENANT_STATUS_META } from "../_utils";

interface TenantRow {
  id: number;
  name: string;
  business_code: string | null;
  email: string;
  phone: string | null;
  status: string;
  owner?: { full_name?: string; email?: string } | null;
  subscription?: { package?: { name?: string } | null; status?: string } | null;
}

const STATUS_FILTERS = [
  { key: "", label: "Tất cả" },
  { key: "active", label: "Đang hoạt động" },
  { key: "suspended", label: "Tạm ngưng" },
  { key: "inactive", label: "Ngừng hoạt động" },
];

const StatusPill = ({ status }: { status: string }) => {
  const meta = TENANT_STATUS_META[status] ?? TENANT_STATUS_META.inactive;
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${meta.className}`}>
      {meta.label}
    </span>
  );
};

const SuperadminTenants = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();

  const [filters, setFilters] = useUrlFilters(
    {
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

  const query = SuperadminService.useTenantList({
    params: {
      search: filters.search || undefined,
      filters: { status: filters.status || undefined },
      page: filters.page,
      per_page: filters.per_page,
    },
  });

  const rows = useMemo<TenantRow[]>(() => listItems(query.data), [query.data]);
  const total = listTotal(query.data);

  const { mutate: suspend, isPending: suspending } = SuperadminService.useTenantSuspend();
  const { mutate: activate, isPending: activating } = SuperadminService.useTenantActivate();

  const handleSuspend = (row: TenantRow) =>
    confirm.warning({
      title: "Tạm ngưng trung tâm",
      content: `Tạm ngưng "${row.name}"? Toàn bộ tài khoản của trung tâm sẽ bị chặn truy cập.`,
      onOk: () =>
        suspend(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã tạm ngưng trung tâm" }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Không thể tạm ngưng" }),
          },
        ),
    });

  const handleActivate = (row: TenantRow) =>
    activate(
      { id: row.id },
      {
        onSuccess: () => notification.success({ message: "Đã kích hoạt lại trung tâm" }),
        onError: (e: any) =>
          notification.error({ message: e?.data?.msg ?? "Không thể kích hoạt" }),
      },
    );

  const columns: TableColumn<TenantRow>[] = [
    {
      key: "name",
      title: "Trung tâm",
      render: (row) => (
        <button
          type="button"
          onClick={() => navigate(`${PATHS.superadminTenantDetail}/${row.id}`)}
          className="text-left font-medium text-slate-800 hover:text-brand"
        >
          {row.name}
          {row.business_code && (
            <span className="ml-1 text-xs text-slate-400">#{row.business_code}</span>
          )}
        </button>
      ),
    },
    {
      key: "owner",
      title: "Chủ sở hữu",
      render: (row) => (
        <div className="text-sm">
          <p className="text-slate-700">{row.owner?.full_name ?? "—"}</p>
          <p className="text-xs text-slate-400">{row.owner?.email ?? row.email}</p>
        </div>
      ),
    },
    {
      key: "plan",
      title: "Gói",
      render: (row) => (
        <span className="text-sm text-slate-700">
          {row.subscription?.package?.name ?? "—"}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => <StatusPill status={row.status} />,
    },
    {
      key: "actions",
      title: "",
      headerClassName: "px-4 py-3 text-right",
      cellClassName: "px-4 py-3 text-right",
      render: (row) =>
        row.status === "suspended" ? (
          <Button
            outlined
            disabled={activating}
            onClick={() => handleActivate(row)}
            className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
          >
            Kích hoạt
          </Button>
        ) : (
          <Button
            outlined
            disabled={suspending}
            onClick={() => handleSuspend(row)}
            className="border-amber-500 text-amber-600 hover:bg-amber-50"
          >
            Tạm ngưng
          </Button>
        ),
    },
  ];

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Quản lý trung tâm</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Toàn bộ trung tâm trên nền tảng và trạng thái đăng ký của họ.
        </p>
      </div>

      <Card>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-1">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.key || "all"}
                type="button"
                onClick={() => setFilters({ status: f.key, page: 1 })}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  filters.status === f.key
                    ? "bg-brand text-white"
                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
          <SearchInput
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm trung tâm, email, SĐT..."
            wrapperClassName="sm:w-72"
          />
        </div>

        <Table
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          isLoading={query.isLoading || query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          emptyText="Chưa có trung tâm nào"
          minWidthClassName="min-w-[720px]"
        />

        <TablePagination
          total={total}
          page={filters.page}
          perPage={filters.per_page}
          unit="trung tâm"
          onChange={(page, perPage) =>
            perPage !== filters.per_page
              ? setFilters({ per_page: perPage, page: 1 })
              : setFilters({ page })
          }
        />
      </Card>
    </div>
  );
};

export default SuperadminTenants;
