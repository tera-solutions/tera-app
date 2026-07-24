import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Input, InputNumber, notification, Select, Spin } from "tera-dls";

import Breadcrumb from "_common/components/Breadcrumb";
import Card from "_common/components/Card";
import ErrorRetry from "_common/components/ErrorRetry";
import FieldLabel from "_common/components/FieldLabel";
import useConfirm from "_common/hooks/useConfirm";
import { PATHS } from "_common/components/Layout/Menu/menus";
import { CourseService } from "@tera/modules/education";
import { SubscriptionPackageService } from "@tera/modules/finance";

import { PACKAGE_TYPE_OPTIONS } from "../SubscriptionPackage/constants";
import DiscountRuleList, { type DiscountRuleRow } from "./components/DiscountRuleList";

const formatDate = (value?: string | null) => (value ? new Date(value).toLocaleDateString("vi-VN") : "—");

const SubscriptionPackageDetail = () => {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { id } = useParams<{ id: string }>();
  const packageId = id ? Number(id) : null;

  const detailQuery = SubscriptionPackageService.useSubscriptionPackageDetail({ id: packageId ?? "" });
  const usagesQuery = SubscriptionPackageService.useSubscriptionPackageUsages({ id: packageId ?? "" });
  const pkg = detailQuery.data?.data;

  const coursesQuery = CourseService.useCourseList({ params: { per_page: 100 } });
  const courses = useMemo(() => coursesQuery.data?.data?.items ?? [], [coursesQuery.data]);

  const [form, setForm] = useState({
    name: "",
    type: "session",
    price: undefined as number | undefined,
    sessions_included: undefined as number | undefined,
    duration_days: undefined as number | undefined,
    applicable_courses: [] as number[],
  });
  const [rules, setRules] = useState<DiscountRuleRow[]>([]);
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  useEffect(() => {
    if (!pkg) return;
    setForm({
      name: pkg.name ?? "",
      type: pkg.type ?? "session",
      price: pkg.price != null ? Number(pkg.price) : undefined,
      sessions_included: pkg.sessions_included ?? undefined,
      duration_days: pkg.duration_days ?? undefined,
      applicable_courses: Array.isArray(pkg.applicable_courses) ? pkg.applicable_courses : [],
    });
    setRules(
      (pkg.discount_rules ?? []).map((r: any) => ({
        type: r.type,
        value: r.value,
        condition: r.condition,
        enabled: !!r.enabled,
      })),
    );
  }, [pkg]);

  const { mutate: update, isPending: saving } = SubscriptionPackageService.useSubscriptionPackageUpdate();
  const { mutate: toggle } = SubscriptionPackageService.useSubscriptionPackageToggle();

  const isCustom = form.type === "custom";

  const handleSave = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên gói" });
      return;
    }
    if (!form.duration_days || form.duration_days < 1) {
      notification.warning({ message: "Thời hạn phải lớn hơn 0" });
      return;
    }
    if (!isCustom && (!form.price || form.price <= 0)) {
      notification.warning({ message: "Giá gói không hợp lệ" });
      return;
    }
    if (!packageId) return;

    update(
      {
        id: packageId,
        params: {
          name: form.name.trim(),
          type: form.type,
          price: form.price ?? null,
          sessions_included: form.sessions_included ?? null,
          duration_days: form.duration_days,
          applicable_courses: form.applicable_courses,
        },
      },
      {
        onSuccess: () => notification.success({ message: "Đã lưu thông tin gói" }),
        onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể lưu" }),
      },
    );
  };

  const handleToggleStatus = () => {
    if (!packageId || !pkg) return;
    const isActive = pkg.status === "active";
    confirm.warning({
      title: isActive ? "Ngừng dùng gói" : "Kích hoạt lại gói",
      content: isActive
        ? "Ngừng dùng gói này? Học viên đang dùng vẫn giữ nguyên, chỉ không áp dụng cho ghi danh mới."
        : "Kích hoạt lại gói này?",
      onOk: () =>
        toggle(
          { id: packageId },
          {
            onSuccess: () => notification.success({ message: "Đã cập nhật trạng thái" }),
            onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Có lỗi xảy ra" }),
          },
        ),
    });
  };

  if (detailQuery.isLoading) {
    return (
      <div className="flex justify-center p-10">
        <Spin />
      </div>
    );
  }

  if (detailQuery.isError || !pkg) {
    return (
      <div className="p-10">
        <ErrorRetry onRetry={() => detailQuery.refetch()} message="Không tải được gói đăng ký" />
      </div>
    );
  }

  const usages = usagesQuery.data?.data;

  return (
    <div className="p-4 xmd:p-6">
      <Breadcrumb
        items={[
          { label: "Gói đăng ký", onClick: () => navigate(PATHS.subscriptionPackages) },
          { label: pkg.name },
        ]}
      />

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-bold text-slate-800">
          Gói đăng ký <span className="text-slate-400">›</span> {pkg.name}
        </h1>
        <div className="flex items-center gap-2">
          <Button outlined onClick={handleToggleStatus} className="text-slate-600 border-slate-300 hover:bg-slate-50">
            {pkg.status === "active" ? "Ngừng dùng" : "Kích hoạt lại"}
          </Button>
          <Button onClick={handleSave} loading={saving} className="bg-brand hover:bg-brand/80">
            Lưu
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_380px]">
        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700">Thông tin gói</p>
          <div className="space-y-3">
            <div>
              <FieldLabel required>Tên gói</FieldLabel>
              <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel required>Loại gói</FieldLabel>
                <Select
                  value={form.type}
                  options={PACKAGE_TYPE_OPTIONS}
                  onChange={(v) => set({ type: v as string })}
                />
              </div>
              <div>
                <FieldLabel required={!isCustom}>Giá</FieldLabel>
                <InputNumber
                  min={0}
                  className="w-full"
                  value={form.price}
                  onChange={(v) => set({ price: v == null ? undefined : Number(v) })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <FieldLabel>Số buổi bao gồm</FieldLabel>
                <InputNumber
                  min={0}
                  className="w-full"
                  value={form.sessions_included}
                  onChange={(v) => set({ sessions_included: v == null ? undefined : Number(v) })}
                />
              </div>
              <div>
                <FieldLabel required>Thời hạn (ngày)</FieldLabel>
                <InputNumber
                  min={1}
                  className="w-full"
                  value={form.duration_days}
                  onChange={(v) => set({ duration_days: v == null ? undefined : Number(v) })}
                />
              </div>
            </div>
            <div>
              <FieldLabel>Khóa học áp dụng</FieldLabel>
              <Select
                mode="multiple"
                value={form.applicable_courses}
                placeholder="Để trống = áp dụng tất cả khóa học"
                options={courses.map((c: any) => ({ value: c.id, label: c.name }))}
                onChange={(v) => set({ applicable_courses: (v as number[]) ?? [] })}
              />
            </div>
          </div>

          <div className="mt-5 border-t border-slate-100 pt-4">
            <DiscountRuleList packageId={packageId as number} rules={rules} onChange={setRules} />
          </div>
        </Card>

        <Card>
          <p className="mb-3 text-sm font-semibold text-slate-700">
            Học viên đang dùng {usages ? `— Tổng: ${usages.total}` : ""}
          </p>
          {usagesQuery.isLoading ? (
            <div className="flex justify-center py-6">
              <Spin />
            </div>
          ) : !usages || usages.data.length === 0 ? (
            <p className="py-4 text-sm text-slate-400">Chưa có học viên nào dùng gói này.</p>
          ) : (
            <div className="space-y-2">
              {usages.data.map((u: any) => (
                <button
                  key={u.student_id}
                  type="button"
                  onClick={() => navigate(`${PATHS.studentDetail}/${u.student_id}`)}
                  className="flex w-full items-center justify-between rounded-lg border border-slate-100 p-2 text-left hover:bg-slate-50"
                >
                  <div>
                    <p className="text-sm font-medium text-slate-700">{u.student_name}</p>
                    <p className="text-xs text-slate-400">{u.course ?? "—"}</p>
                  </div>
                  <span className="text-xs text-slate-400">{formatDate(u.started_at)}</span>
                </button>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionPackageDetail;
