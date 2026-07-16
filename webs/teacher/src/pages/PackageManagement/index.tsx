import { useMemo } from "react";
import { notification } from "tera-dls";

import Card from "_common/components/Card";
import TablePagination from "_common/components/TablePagination";
import useConfirm from "_common/hooks/useConfirm";
import { useUrlFilters } from "_common/hooks/useUrlFilters";
import { DEFAULT_PAGE_SIZE } from "_common/constants/pagination";
import { PackageService, SubscriptionService } from "@tera/modules/system";

import type { PackageOption } from "./_interface";
import { toCurrentSubscription, toPackages, toSubscriptionInvoices } from "./_utils";
import CurrentPackageCard from "./components/CurrentPackageCard";
import UpgradeOptionCard from "./components/UpgradeOptionCard";
import InvoiceHistoryTable from "./components/InvoiceHistoryTable";

const PackageManagement = () => {
  const confirm = useConfirm();

  const [filters, setFilters] = useUrlFilters(
    { page: { type: "number", default: 1 }, per_page: { type: "number", default: DEFAULT_PAGE_SIZE } },
    { syncDefaultsOnMount: true },
  );

  const currentQuery = SubscriptionService.useSubscriptionCurrent();
  const subscription = useMemo(() => toCurrentSubscription(currentQuery.data), [currentQuery.data]);

  const packagesQuery = PackageService.usePackageList({ params: { per_page: 20 } });
  const packages = useMemo(() => toPackages(packagesQuery.data), [packagesQuery.data]);

  const invoicesQuery = SubscriptionService.useSubscriptionInvoiceList({
    params: { page: filters.page, per_page: filters.per_page },
  });
  const invoices = useMemo(() => toSubscriptionInvoices(invoicesQuery.data), [invoicesQuery.data]);
  const total = invoicesQuery.data?.data?.pagination?.total ?? invoices.length;

  const { mutate: upgrade } = SubscriptionService.useSubscriptionUpgrade();

  const handleUpgrade = (pkg: PackageOption) => {
    confirm.warning({
      title: "Nâng cấp gói",
      content: `Bạn có chắc muốn chuyển sang "${pkg.name}"?`,
      onOk: () =>
        upgrade(
          { params: { package_id: pkg.id } },
          {
            onSuccess: () => notification.success({ message: "Nâng cấp gói thành công" }),
            onError: (error: any) =>
              notification.error({ message: error?.data?.msg ?? "Không thể nâng cấp gói" }),
          },
        ),
    });
  };

  const upgradablePackages = packages.filter((p) => p.id !== subscription?.packageId);

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Gói đã đăng ký &amp; hóa đơn gói</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Quản lý thông tin gói dịch vụ, thời hạn và lịch sử hóa đơn của bạn.
        </p>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
        <CurrentPackageCard
          subscription={subscription}
          loading={currentQuery.isLoading}
          onUpgrade={() => document.getElementById("upgrade-options")?.scrollIntoView({ behavior: "smooth" })}
        />
        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700">Tổng quan gói</p>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-xs text-slate-400">Ngày bắt đầu</p>
              <p className="font-medium text-slate-700">{subscription?.startedAt ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Ngày hết hạn</p>
              <p className="font-medium text-slate-700">{subscription?.expiresAt ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Trạng thái</p>
              <p className="font-medium text-slate-700">
                {subscription?.status === "active" ? "Đang hoạt động" : "Chưa đăng ký"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div id="upgrade-options" className="mb-4">
        <p className="mb-3 text-sm font-semibold text-slate-700">Nâng cấp gói để trải nghiệm nhiều tính năng hơn</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {upgradablePackages.map((pkg) => (
            <UpgradeOptionCard key={pkg.id} pkg={pkg} onUpgrade={handleUpgrade} />
          ))}
        </div>
      </div>

      <Card>
        <p className="mb-3 text-sm font-semibold text-slate-700">Lịch sử hóa đơn gói</p>
        <InvoiceHistoryTable
          items={invoices}
          loading={invoicesQuery.isLoading}
          isError={invoicesQuery.isError}
          onRetry={() => invoicesQuery.refetch()}
        />
        <TablePagination
          total={total}
          page={filters.page}
          perPage={filters.per_page}
          unit="hóa đơn"
          onChange={(page, per_page) => setFilters({ page, per_page })}
        />
      </Card>
    </div>
  );
};

export default PackageManagement;
