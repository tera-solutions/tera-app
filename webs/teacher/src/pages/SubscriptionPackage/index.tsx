import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  CheckCircleOutlined,
  NoSymbolOutlined,
  notification,
  PlusOutlined,
  Select,
  Squares2x2Outlined,
} from "tera-dls";

import Card from "_common/components/Card";
import SearchInput from "_common/components/SearchInput";
import StatisticCard from "_common/components/StatisticCard";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useDebouncedSearch } from "_common/hooks/useDebouncedSearch";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { SubscriptionPackageService } from "@tera/modules/finance";

import type { SubscriptionPackageRow } from "./_interface";
import { PACKAGE_STATUS_OPTIONS, PACKAGE_TYPE_OPTIONS, packageTypeLabel } from "./constants";
import QuickAddModal from "./QuickAddModal";

const formatCurrency = (value: number | string | null | undefined) => {
  const n = Number(value ?? 0);
  return n > 0 ? `${n.toLocaleString("vi-VN")}đ` : "—";
};

/** Danh sách gói đăng ký học phí (theo buổi/tháng/kỳ/tùy chỉnh) do admin tạo
 * để áp dụng khi ghi danh học viên — teacher-app-081. Distinct from
 * PackageManagement (gói dịch vụ SaaS của chính trung tâm). */
const SubscriptionPackage = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [addOpen, setAddOpen] = useState(false);

  const [filters, setFilters] = useUrlFilters(
    {
      search: { type: "string", default: "" },
      status: { type: "string", default: "" },
      type: { type: "string", default: "" },
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const [searchDraft, setSearchDraft] = useDebouncedSearch(filters.search, (trimmed) =>
    setFilters({ search: trimmed, page: 1 }),
  );

  const query = SubscriptionPackageService.useSubscriptionPackageList({
    params: {
      search: filters.search || undefined,
      status: filters.status || undefined,
      type: filters.type || undefined,
      page: filters.page,
      per_page: filters.per_page,
    },
  });
  const rows = useMemo<SubscriptionPackageRow[]>(() => query.data?.data?.items ?? [], [query.data]);
  const total = query.data?.data?.pagination?.total ?? 0;
  const summary = query.data?.data?.summary ?? { total: 0, active: 0, inactive: 0 };

  const { mutate: toggle } = SubscriptionPackageService.useSubscriptionPackageToggle();
  const { mutate: remove } = SubscriptionPackageService.useSubscriptionPackageDelete();

  const handleToggle = (row: SubscriptionPackageRow) => {
    toggle(
      { id: row.id },
      {
        onSuccess: () => notification.success({ message: "Đã cập nhật trạng thái" }),
        onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Có lỗi xảy ra" }),
      },
    );
  };

  const handleDelete = (row: SubscriptionPackageRow) => {
    confirm.warning({
      title: "Xóa gói đăng ký",
      content: `Xóa gói "${row.name}"? Học viên đang dùng gói này sẽ không bị ảnh hưởng nếu gói đang được sử dụng.`,
      onOk: () =>
        remove(
          { id: row.id },
          {
            onSuccess: () => notification.success({ message: "Đã xóa gói đăng ký" }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Gói đang được sử dụng, không thể xóa" }),
          },
        ),
    });
  };

  const columns: TableColumn<SubscriptionPackageRow>[] = [
    {
      key: "name",
      title: "Tên gói",
      render: (row) => (
        <button
          type="button"
          onClick={() => navigate(`${PATHS.subscriptionPackages}/${row.id}`)}
          className="font-medium text-brand hover:underline"
        >
          {row.name}
        </button>
      ),
    },
    { key: "type", title: "Loại", render: (row) => <span className="text-sm text-slate-600">{packageTypeLabel(row.type)}</span> },
    { key: "price", title: "Giá", render: (row) => <span className="text-sm text-slate-600">{formatCurrency(row.price)}</span> },
    {
      key: "applicable_courses",
      title: "Khóa học áp dụng",
      render: (row) => (
        <span className="text-sm text-slate-500">
          {!row.applicable_courses || row.applicable_courses.length === 0
            ? "Tất cả"
            : `${row.applicable_courses.length} khóa`}
        </span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            row.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.status === "active" ? "Đang dùng" : "Ngừng dùng"}
        </span>
      ),
    },
    {
      key: "actions",
      title: "",
      headerClassName: "px-4 py-3 text-right",
      cellClassName: "px-4 py-3 text-right",
      render: (row) => (
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={() => navigate(`${PATHS.subscriptionPackages}/${row.id}`)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => handleToggle(row)}
            className="text-xs font-medium text-slate-500 hover:underline"
          >
            {row.status === "active" ? "Ngừng" : "Kích hoạt"}
          </button>
          <button
            type="button"
            onClick={() => handleDelete(row)}
            className="text-xs font-medium text-rose-500 hover:underline"
          >
            Xóa
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Gói đăng ký</h1>
          <p className="mt-0.5 text-sm text-slate-400">Quản lý các gói học phí áp dụng cho ghi danh.</p>
        </div>
        <Button icon={<PlusOutlined />} onClick={() => setAddOpen(true)} className="bg-brand hover:bg-brand/80">
          Thêm gói đăng ký
        </Button>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatisticCard
          icon={<Squares2x2Outlined />}
          value={summary.total}
          label="Tổng gói"
          iconClassName="bg-sky-50 text-brand"
          loading={query.isLoading}
        />
        <StatisticCard
          icon={<CheckCircleOutlined />}
          value={summary.active}
          label="Đang dùng"
          iconClassName="bg-emerald-50 text-emerald-500"
          loading={query.isLoading}
        />
        <StatisticCard
          icon={<NoSymbolOutlined />}
          value={summary.inactive}
          label="Ngừng dùng"
          iconClassName="bg-slate-100 text-slate-500"
          loading={query.isLoading}
        />
      </div>

      <Card>
        <div className="mb-3 flex flex-wrap items-center gap-3">
          <SearchInput
            value={searchDraft}
            onChange={(e) => setSearchDraft(e.target.value)}
            placeholder="Tìm gói đăng ký..."
            wrapperClassName="sm:w-72"
          />
          <Select
            value={filters.type || undefined}
            placeholder="Tất cả loại gói"
            options={PACKAGE_TYPE_OPTIONS}
            onChange={(v) => setFilters({ type: (v as string) ?? "", page: 1 })}
            className="sm:w-48"
          />
          <Select
            value={filters.status || undefined}
            placeholder="Tất cả trạng thái"
            options={PACKAGE_STATUS_OPTIONS}
            onChange={(v) => setFilters({ status: (v as string) ?? "", page: 1 })}
            className="sm:w-48"
          />
        </div>

        <Table
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          isLoading={query.isLoading || query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          emptyText="Chưa có gói đăng ký nào"
          minWidthClassName="min-w-[720px]"
        />
        <TablePagination
          total={total}
          page={filters.page}
          perPage={filters.per_page}
          unit="gói"
          onChange={(page, perPage) =>
            perPage !== filters.per_page ? setFilters({ per_page: perPage, page: 1 }) : setFilters({ page })
          }
        />
      </Card>

      <QuickAddModal open={addOpen} onClose={() => setAddOpen(false)} />
    </div>
  );
};

export default SubscriptionPackage;
