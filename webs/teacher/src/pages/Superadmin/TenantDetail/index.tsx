import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftOutlined, Button, InputNumber, notification, Select, Spin } from "tera-dls";

import Card from "_common/components/Card";
import { PATHS } from "_common/components/Layout/Menu/menus";
import useConfirm from "_common/hooks/useConfirm";
import { SuperadminService } from "@tera/modules/system";

import {
  formatNumber,
  formatVnd,
  listItems,
  payload,
  SUBSCRIPTION_STATUS_META,
  TENANT_STATUS_META,
} from "../_utils";

const StatTile = ({ label, value }: { label: string; value: string }) => (
  <div className="rounded-xl bg-slate-50 p-3">
    <p className="text-xs text-slate-400">{label}</p>
    <p className="text-lg font-bold text-slate-800">{value}</p>
  </div>
);

const SuperadminTenantDetail = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { id } = useParams<{ id: string }>();
  const tenantId = Number(id);

  const query = SuperadminService.useTenantDetail({ id: tenantId });
  const data = useMemo(() => payload<any>(query.data), [query.data]);
  const business = data?.business;
  const statistics = data?.statistics;
  const subscription = data?.subscription;
  const invoices = data?.invoices ?? [];

  const packagesQuery = SuperadminService.usePackageAdminList({ params: { per_page: 100 } });
  const packages = useMemo(() => listItems<any>(packagesQuery.data), [packagesQuery.data]);

  const [packageId, setPackageId] = useState<number | "">("");
  const [billingCycle, setBillingCycle] = useState<"month" | "year">("month");
  const [months, setMonths] = useState(1);

  const { mutate: suspend } = SuperadminService.useTenantSuspend();
  const { mutate: activate } = SuperadminService.useTenantActivate();
  const { mutate: assignPlan, isPending: assigning } = SuperadminService.useAssignPlan();
  const { mutate: extend, isPending: extending } = SuperadminService.useExtendSubscription();
  const { mutate: cancel } = SuperadminService.useCancelSubscription();

  const ok = (message: string) => () => notification.success({ message });
  const fail = (fallback: string) => (e: any) =>
    notification.error({ message: e?.data?.msg ?? fallback });

  const handleAssign = () => {
    if (!packageId) {
      notification.warning({ message: "Vui lòng chọn gói" });
      return;
    }
    assignPlan(
      { id: tenantId, params: { package_id: Number(packageId), billing_cycle: billingCycle } },
      { onSuccess: ok("Đã gán gói cho trung tâm"), onError: fail("Không thể gán gói") },
    );
  };

  const handleExtend = () =>
    extend(
      { id: tenantId, params: { months } },
      { onSuccess: ok("Đã gia hạn gói"), onError: fail("Không thể gia hạn") },
    );

  const handleCancel = () =>
    confirm.warning({
      title: "Hủy gói",
      content: "Hủy gói đang hoạt động của trung tâm này?",
      onOk: () =>
        cancel({ id: tenantId }, { onSuccess: ok("Đã hủy gói"), onError: fail("Không thể hủy") }),
    });

  const statusMeta = TENANT_STATUS_META[business?.status] ?? TENANT_STATUS_META.inactive;
  const subMeta = subscription
    ? SUBSCRIPTION_STATUS_META[subscription.status] ?? SUBSCRIPTION_STATUS_META.cancelled
    : null;

  return (
    <div className="p-4 xmd:p-6">
      <button
        type="button"
        onClick={() => navigate(PATHS.superadminTenants)}
        className="mb-4 flex items-center gap-1 text-sm text-slate-500 hover:text-brand"
      >
        <ArrowLeftOutlined className="h-4 w-4" /> Danh sách trung tâm
      </button>

      <Spin spinning={query.isLoading}>
        <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1.4fr_1fr]">
          <div className="space-y-4">
            <Card>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h1 className="text-xl font-bold text-slate-800">{business?.name ?? "—"}</h1>
                  <p className="mt-0.5 text-sm text-slate-400">
                    {business?.email} · {business?.phone ?? "—"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusMeta.className}`}
                >
                  {statusMeta.label}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                {business?.status === "suspended" ? (
                  <Button
                    outlined
                    onClick={() =>
                      activate(
                        { id: tenantId },
                        { onSuccess: ok("Đã kích hoạt lại"), onError: fail("Lỗi") },
                      )
                    }
                    className="border-emerald-500 text-emerald-600 hover:bg-emerald-50"
                  >
                    Kích hoạt lại
                  </Button>
                ) : (
                  <Button
                    outlined
                    onClick={() =>
                      confirm.warning({
                        title: "Tạm ngưng trung tâm",
                        content: `Tạm ngưng "${business?.name}"?`,
                        onOk: () =>
                          suspend(
                            { id: tenantId },
                            { onSuccess: ok("Đã tạm ngưng"), onError: fail("Lỗi") },
                          ),
                      })
                    }
                    className="border-amber-500 text-amber-600 hover:bg-amber-50"
                  >
                    Tạm ngưng
                  </Button>
                )}
              </div>
            </Card>

            <Card>
              <p className="mb-3 text-sm font-semibold text-slate-700">Số liệu sử dụng</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <StatTile label="Học viên" value={formatNumber(statistics?.total_students)} />
                <StatTile label="Phụ huynh" value={formatNumber(statistics?.total_parents)} />
                <StatTile label="Giáo viên" value={formatNumber(statistics?.total_teachers)} />
                <StatTile label="Khóa học" value={formatNumber(statistics?.total_courses)} />
                <StatTile label="Lớp học" value={formatNumber(statistics?.total_classes)} />
              </div>
            </Card>

            <Card>
              <p className="mb-3 text-sm font-semibold text-slate-700">Lịch sử hóa đơn</p>
              {invoices.length === 0 ? (
                <p className="py-4 text-center text-sm text-slate-400">Chưa có hóa đơn</p>
              ) : (
                <div className="divide-y divide-slate-100">
                  {invoices.map((inv: any) => (
                    <div key={inv.id} className="flex items-center justify-between py-2.5 text-sm">
                      <div>
                        <p className="font-medium text-slate-700">{inv.package_name}</p>
                        <p className="text-xs text-slate-400">
                          {inv.code} · {inv.paid_at ?? "—"}
                        </p>
                      </div>
                      <span className="font-semibold text-slate-800">{formatVnd(inv.amount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-4">
            <Card>
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-700">Gói hiện tại</p>
                {subMeta && (
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${subMeta.className}`}
                  >
                    {subMeta.label}
                  </span>
                )}
              </div>
              {subscription ? (
                <div className="space-y-1 text-sm">
                  <p className="text-lg font-bold text-slate-800">
                    {subscription.package?.name ?? "—"}
                  </p>
                  <p className="text-slate-500">{formatVnd(subscription.price)} / {subscription.billing_cycle === "year" ? "năm" : "tháng"}</p>
                  <p className="text-xs text-slate-400">
                    {subscription.started_at} → {subscription.expires_at ?? "—"}
                  </p>
                </div>
              ) : (
                <p className="py-2 text-sm text-slate-400">Chưa có gói đang hoạt động</p>
              )}
            </Card>

            <Card className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Gán / đổi gói</p>
              <Select
                value={packageId}
                onChange={(v) => setPackageId(v ? Number(v) : "")}
                placeholder="— Chọn gói —"
                allowClear
                options={packages.map((p) => ({
                  value: p.id,
                  label: `${p.name} (${formatVnd(p.price)})`,
                }))}
                className="w-full"
              />
              <Select
                value={billingCycle}
                onChange={(v) => setBillingCycle(v as "month" | "year")}
                options={[
                  { value: "month", label: "Theo tháng" },
                  { value: "year", label: "Theo năm" },
                ]}
                className="w-full"
              />
              <Button
                onClick={handleAssign}
                loading={assigning}
                className="w-full justify-center bg-brand hover:bg-brand/80"
              >
                Gán gói
              </Button>
            </Card>

            <Card className="space-y-3">
              <p className="text-sm font-semibold text-slate-700">Gia hạn</p>
              <div className="flex items-center gap-2">
                <InputNumber
                  min={1}
                  max={36}
                  value={months}
                  onChange={(v) => setMonths(Math.max(1, typeof v === "number" ? v : 1))}
                  className="w-full"
                />
                <span className="shrink-0 text-sm text-slate-500">tháng</span>
              </div>
              <Button
                outlined
                onClick={handleExtend}
                loading={extending}
                disabled={!subscription}
                className="w-full justify-center border-brand text-brand hover:bg-brand/10"
              >
                Gia hạn
              </Button>
              {subscription && (
                <button
                  type="button"
                  onClick={handleCancel}
                  className="w-full text-center text-xs font-medium text-rose-500 hover:underline"
                >
                  Hủy gói hiện tại
                </button>
              )}
            </Card>
          </div>
        </div>
      </Spin>
    </div>
  );
};

export default SuperadminTenantDetail;
