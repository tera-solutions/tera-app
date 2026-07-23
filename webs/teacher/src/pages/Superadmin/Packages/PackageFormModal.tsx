import { useEffect, useState } from "react";
import { Input, InputNumber, notification, Select, TextArea } from "tera-dls";

import { SuperadminService } from "@tera/modules/system";
import FormScaff from "@tera/components/dof/FormScaff";
import FieldLabel from "_common/components/FieldLabel";

const BILLING_CYCLE_OPTIONS = [
  { value: "month", label: "Theo tháng" },
  { value: "year", label: "Theo năm" },
];

const LIMIT_FIELDS: Array<{ key: string; label: string }> = [
  { key: "students", label: "Học viên" },
  { key: "classes", label: "Lớp học" },
  { key: "teachers", label: "Giáo viên" },
  { key: "parents", label: "Phụ huynh" },
  { key: "branches", label: "Chi nhánh" },
];

export interface PackageRow {
  id: number;
  package_code: string;
  name: string;
  description?: string | null;
  price: number | string;
  billing_cycle: "month" | "year";
  features?: string[] | null;
  limits?: Record<string, number | null> | null;
  badge?: string | null;
  sort_order?: number;
}

interface Props {
  open: boolean;
  pkg: PackageRow | null;
  onClose: () => void;
}

const emptyLimits = () =>
  LIMIT_FIELDS.reduce<Record<string, string>>((acc, f) => ({ ...acc, [f.key]: "" }), {});

const PackageFormModal = ({ open, pkg, onClose }: Props) => {
  const isEdit = !!pkg;
  const { mutate: create, isPending: creating } = SuperadminService.usePackageCreate();
  const { mutate: update, isPending: updating } = SuperadminService.usePackageUpdate();

  const [form, setForm] = useState({
    package_code: "",
    name: "",
    description: "",
    price: "",
    billing_cycle: "month" as "month" | "year",
    badge: "",
    sort_order: "0",
    features: "",
    limits: emptyLimits(),
  });

  useEffect(() => {
    if (!open) return;
    if (pkg) {
      setForm({
        package_code: pkg.package_code,
        name: pkg.name,
        description: pkg.description ?? "",
        price: String(pkg.price ?? ""),
        billing_cycle: pkg.billing_cycle,
        badge: pkg.badge ?? "",
        sort_order: String(pkg.sort_order ?? 0),
        features: (pkg.features ?? []).join("\n"),
        limits: LIMIT_FIELDS.reduce<Record<string, string>>((acc, f) => {
          const v = pkg.limits?.[f.key];
          return { ...acc, [f.key]: v == null ? "" : String(v) };
        }, {}),
      });
    } else {
      setForm({
        package_code: "",
        name: "",
        description: "",
        price: "",
        billing_cycle: "month",
        badge: "",
        sort_order: "0",
        features: "",
        limits: emptyLimits(),
      });
    }
  }, [open, pkg]);

  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }));

  const buildParams = () => {
    const limits: Record<string, number | null> = {};
    LIMIT_FIELDS.forEach((f) => {
      const raw = form.limits[f.key];
      limits[f.key] = raw === "" ? null : Number(raw);
    });
    return {
      name: form.name.trim(),
      description: form.description.trim() || null,
      price: Number(form.price || 0),
      billing_cycle: form.billing_cycle,
      badge: form.badge.trim() || null,
      sort_order: Number(form.sort_order || 0),
      features: form.features
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
      limits,
    };
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      notification.warning({ message: "Vui lòng nhập tên gói" });
      return;
    }
    const done = {
      onSuccess: () => {
        notification.success({ message: isEdit ? "Đã cập nhật gói" : "Đã tạo gói" });
        onClose();
      },
      onError: (e: any) =>
        notification.error({ message: e?.data?.msg?.message ?? e?.data?.msg ?? "Không thể lưu gói" }),
    };

    if (isEdit && pkg) {
      update({ id: pkg.id, params: buildParams() }, done);
    } else {
      if (!form.package_code.trim()) {
        notification.warning({ message: "Vui lòng nhập mã gói" });
        return;
      }
      create({ params: { package_code: form.package_code.trim().toUpperCase(), ...buildParams() } }, done);
    }
  };

  return (
    <FormScaff
      open={open}
      onClose={onClose}
      isEdit={isEdit}
      titleCreate="Tạo gói dịch vụ"
      titleEdit="Sửa gói dịch vụ"
      className="!w-[95%] xmd:!w-[600px]"
      okText={isEdit ? "Lưu" : "Tạo gói"}
      confirmLoading={creating || updating}
      onOk={handleSubmit}
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        {!isEdit && (
          <div>
            <FieldLabel required>Mã gói</FieldLabel>
            <Input
              value={form.package_code}
              onChange={(e) => set({ package_code: e.target.value })}
              placeholder="PKG-BASIC"
            />
          </div>
        )}
        <div>
          <FieldLabel required>Tên gói</FieldLabel>
          <Input value={form.name} onChange={(e) => set({ name: e.target.value })} />
        </div>
        <div>
          <FieldLabel>Mô tả</FieldLabel>
          <TextArea
            className="w-full"
            rows={2}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Giá (₫)</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.price ? Number(form.price) : undefined}
              onChange={(v) => set({ price: v == null ? "" : String(v) })}
            />
          </div>
          <div>
            <FieldLabel>Chu kỳ</FieldLabel>
            <Select
              value={form.billing_cycle}
              options={BILLING_CYCLE_OPTIONS}
              onChange={(v) => set({ billing_cycle: v as "month" | "year" })}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel>Nhãn (badge)</FieldLabel>
            <Input
              value={form.badge}
              onChange={(e) => set({ badge: e.target.value })}
              placeholder="Phổ biến"
            />
          </div>
          <div>
            <FieldLabel>Thứ tự</FieldLabel>
            <InputNumber
              min={0}
              className="w-full"
              value={form.sort_order ? Number(form.sort_order) : undefined}
              onChange={(v) => set({ sort_order: v == null ? "" : String(v) })}
            />
          </div>
        </div>
        <div>
          <FieldLabel>Giới hạn (để trống = không giới hạn)</FieldLabel>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LIMIT_FIELDS.map((f) => (
              <div key={f.key}>
                <span className="mb-1 block text-[11px] text-slate-400">{f.label}</span>
                <InputNumber
                  min={0}
                  className="w-full"
                  value={form.limits[f.key] ? Number(form.limits[f.key]) : undefined}
                  onChange={(v) =>
                    set({ limits: { ...form.limits, [f.key]: v == null ? "" : String(v) } })
                  }
                  placeholder="∞"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <FieldLabel>Tính năng (mỗi dòng một mục)</FieldLabel>
          <TextArea
            className="w-full"
            rows={4}
            value={form.features}
            onChange={(e) => set({ features: e.target.value })}
            placeholder={"Quản lý lớp học\nĐiểm danh học viên"}
          />
        </div>
      </div>
    </FormScaff>
  );
};

export default PackageFormModal;
