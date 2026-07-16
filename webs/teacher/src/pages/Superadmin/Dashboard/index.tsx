import { useMemo } from "react";
import { Spin } from "tera-dls";

import Card from "_common/components/Card";
import { SuperadminService } from "@tera/modules/system";

import { formatNumber, formatVnd, payload } from "../_utils";

interface DashboardData {
  tenants: {
    total: number;
    active: number;
    suspended: number;
    inactive: number;
    new_this_month: number;
  };
  subscriptions: {
    active_total: number;
    trial: number;
    paid: number;
    expired: number;
  };
  revenue: { mrr: number; invoices_paid_total: number };
  plans: Array<{
    package_id: number;
    package_code: string | null;
    name: string | null;
    active_subscriptions: number;
  }>;
  tenants_by_month: Array<{ month: string; count: number }>;
}

const StatCard = ({
  label,
  value,
  hint,
  accent = "text-slate-800",
}: {
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) => (
  <Card className="flex flex-col gap-1">
    <p className="text-xs font-medium text-slate-400">{label}</p>
    <p className={`text-2xl font-bold ${accent}`}>{value}</p>
    {hint && <p className="text-xs text-slate-400">{hint}</p>}
  </Card>
);

const SuperadminDashboard = () => {
  const query = SuperadminService.usePlatformDashboard();
  const data = useMemo(() => payload<DashboardData>(query.data), [query.data]);

  const maxMonth = useMemo(
    () => Math.max(1, ...(data?.tenants_by_month ?? []).map((m) => m.count)),
    [data],
  );

  return (
    <div className="p-4 xmd:p-6">
      <div className="mb-4">
        <h1 className="text-xl font-bold text-slate-800">Tổng quan nền tảng</h1>
        <p className="mt-0.5 text-sm text-slate-400">
          Số liệu toàn bộ trung tâm, gói đăng ký và doanh thu.
        </p>
      </div>

      <Spin spinning={query.isLoading}>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Tổng trung tâm"
            value={formatNumber(data?.tenants.total)}
            hint={`+${formatNumber(data?.tenants.new_this_month)} trong tháng`}
          />
          <StatCard
            label="Đang hoạt động"
            value={formatNumber(data?.tenants.active)}
            accent="text-emerald-600"
          />
          <StatCard
            label="Tạm ngưng"
            value={formatNumber(data?.tenants.suspended)}
            accent="text-amber-600"
          />
          <StatCard
            label="MRR"
            value={formatVnd(data?.revenue.mrr)}
            hint={`Đã thu: ${formatVnd(data?.revenue.invoices_paid_total)}`}
            accent="text-brand"
          />
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          <StatCard
            label="Gói đang chạy"
            value={formatNumber(data?.subscriptions.active_total)}
          />
          <StatCard
            label="Đang dùng thử"
            value={formatNumber(data?.subscriptions.trial)}
          />
          <StatCard
            label="Trả phí"
            value={formatNumber(data?.subscriptions.paid)}
            accent="text-emerald-600"
          />
          <StatCard
            label="Hết hạn"
            value={formatNumber(data?.subscriptions.expired)}
            accent="text-rose-600"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-2">
          <Card>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Phân bổ theo gói
            </p>
            {(data?.plans ?? []).length === 0 ? (
              <p className="py-6 text-center text-sm text-slate-400">
                Chưa có gói nào đang chạy
              </p>
            ) : (
              <div className="space-y-2">
                {data?.plans.map((p) => (
                  <div
                    key={p.package_id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-slate-700">
                      {p.name ?? p.package_code}
                    </span>
                    <span className="font-semibold text-slate-800">
                      {formatNumber(p.active_subscriptions)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card>
            <p className="mb-3 text-sm font-semibold text-slate-700">
              Trung tâm mới theo tháng
            </p>
            <div className="space-y-2">
              {(data?.tenants_by_month ?? []).map((m) => (
                <div key={m.month} className="flex items-center gap-3 text-xs">
                  <span className="w-16 shrink-0 text-slate-400">{m.month}</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-brand"
                      style={{ width: `${(m.count / maxMonth) * 100}%` }}
                    />
                  </div>
                  <span className="w-6 shrink-0 text-right font-medium text-slate-600">
                    {m.count}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </Spin>
    </div>
  );
};

export default SuperadminDashboard;
