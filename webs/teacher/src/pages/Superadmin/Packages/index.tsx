import { useMemo, useState } from "react";
import { Button, notification, PlusOutlined } from "tera-dls";

import Card from "_common/components/Card";
import Table, { TableColumn } from "_common/components/Table";
import TablePagination from "_common/components/TablePagination";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import useConfirm from "_common/hooks/useConfirm";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { SuperadminService } from "@tera/modules/system";

import { formatVnd, listItems, listTotal } from "../_utils";
import PackageFormModal, { type PackageRow } from "./PackageFormModal";

const limitsSummary = (limits?: Record<string, number | null> | null): string => {
  if (!limits) return "—";
  const parts = Object.entries(limits).map(
    ([k, v]) => `${k}: ${v == null ? "∞" : v}`,
  );
  return parts.length ? parts.join(" · ") : "—";
};

const SuperadminPackages = () => {
  const confirm = useConfirm();

  const [filters, setFilters] = useUrlFilters(
    {
      page: { type: "number", default: 1 },
      per_page: { type: "number", default: DEFAULT_PAGE_SIZE },
    },
    { syncDefaultsOnMount: true },
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<PackageRow | null>(null);

  const query = SuperadminService.usePackageAdminList({
    params: { page: filters.page, per_page: filters.per_page },
  });
  const rows = useMemo<PackageRow[]>(() => listItems(query.data), [query.data]);
  const total = listTotal(query.data);

  const { mutate: activate } = SuperadminService.usePackageActivate();
  const { mutate: deactivate } = SuperadminService.usePackageDeactivate();

  const openCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };
  const openEdit = (pkg: PackageRow) => {
    setEditing(pkg);
    setModalOpen(true);
  };

  const toggleActive = (pkg: PackageRow & { is_active?: boolean }) => {
    const fn = pkg.is_active ? deactivate : activate;
    const msg = pkg.is_active ? "Đã ẩn gói" : "Đã kích hoạt gói";
    confirm.warning({
      title: pkg.is_active ? "Ẩn gói" : "Kích hoạt gói",
      content: pkg.is_active
        ? `Ẩn "${pkg.name}" khỏi danh sách gói của trung tâm?`
        : `Hiển thị "${pkg.name}" cho các trung tâm?`,
      onOk: () =>
        fn(
          { id: pkg.id },
          {
            onSuccess: () => notification.success({ message: msg }),
            onError: (e: any) =>
              notification.error({ message: e?.data?.msg ?? "Có lỗi xảy ra" }),
          },
        ),
    });
  };

  const columns: TableColumn<PackageRow & { is_active?: boolean }>[] = [
    {
      key: "name",
      title: "Gói",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">
            {row.name}
            {row.badge && (
              <span className="ml-1 rounded bg-sky-50 px-1.5 py-0.5 text-[11px] text-brand">
                {row.badge}
              </span>
            )}
          </p>
          <p className="text-xs text-slate-400">{row.package_code}</p>
        </div>
      ),
    },
    {
      key: "price",
      title: "Giá",
      render: (row) => (
        <span className="text-sm text-slate-700">
          {formatVnd(row.price)}
          <span className="text-xs text-slate-400">
            /{row.billing_cycle === "year" ? "năm" : "tháng"}
          </span>
        </span>
      ),
    },
    {
      key: "limits",
      title: "Giới hạn",
      render: (row) => (
        <span className="text-xs text-slate-500">{limitsSummary(row.limits)}</span>
      ),
    },
    {
      key: "status",
      title: "Trạng thái",
      render: (row) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            row.is_active ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
          }`}
        >
          {row.is_active ? "Hiển thị" : "Ẩn"}
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
            onClick={() => openEdit(row)}
            className="text-xs font-medium text-brand hover:underline"
          >
            Sửa
          </button>
          <button
            type="button"
            onClick={() => toggleActive(row)}
            className="text-xs font-medium text-slate-500 hover:underline"
          >
            {row.is_active ? "Ẩn" : "Hiện"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Gói dịch vụ</h1>
          <p className="mt-0.5 text-sm text-slate-400">
            Quản lý bảng giá và hạn mức của từng gói.
          </p>
        </div>
        <Button
          icon={<PlusOutlined />}
          onClick={openCreate}
          className="bg-brand hover:bg-brand/80"
        >
          Tạo gói
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          data={rows}
          rowKey={(row) => row.id}
          isLoading={query.isLoading || query.isFetching}
          isError={query.isError}
          onRetry={() => query.refetch()}
          emptyText="Chưa có gói nào"
          minWidthClassName="min-w-[720px]"
        />
        <TablePagination
          total={total}
          page={filters.page}
          perPage={filters.per_page}
          unit="gói"
          onChange={(page, perPage) =>
            perPage !== filters.per_page
              ? setFilters({ per_page: perPage, page: 1 })
              : setFilters({ page })
          }
        />
      </Card>

      <PackageFormModal open={modalOpen} pkg={editing} onClose={() => setModalOpen(false)} />
    </div>
  );
};

export default SuperadminPackages;
