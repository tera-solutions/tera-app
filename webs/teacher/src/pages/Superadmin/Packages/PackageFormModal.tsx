import { useEffect, useState } from "react";
import { Modal, notification } from "tera-dls";

import { SuperadminService } from "@tera/modules/system";

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-700 focus:border-brand focus:outline-none";
const labelClass = "mb-1 block text-xs font-medium text-slate-500";

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
    <Modal
      title={isEdit ? "Sửa gói dịch vụ" : "Tạo gói dịch vụ"}
      open={open}
      className="!w-[95%] xmd:!w-[600px]"
      okText={isEdit ? "Lưu" : "Tạo gói"}
      cancelText="Hủy"
      confirmLoading={creating || updating}
      onOk={handleSubmit}
      onCancel={onClose}
      destroyOnClose
    >
      <div className="max-h-[70vh] space-y-3 overflow-y-auto pr-1">
        {!isEdit && (
          <div>
            <label className={labelClass}>Mã gói *</label>
            <input
              className={inputClass}
              value={form.package_code}
              onChange={(e) => set({ package_code: e.target.value })}
              placeholder="PKG-BASIC"
            />
          </div>
        )}
        <div>
          <label className={labelClass}>Tên gói *</label>
          <input
            className={inputClass}
            value={form.name}
            onChange={(e) => set({ name: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Mô tả</label>
          <textarea
            className={inputClass}
            rows={2}
            value={form.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Giá (₫)</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.price}
              onChange={(e) => set({ price: e.target.value })}
            />
          </div>
          <div>
            <label className={labelClass}>Chu kỳ</label>
            <select
              className={inputClass}
              value={form.billing_cycle}
              onChange={(e) => set({ billing_cycle: e.target.value as "month" | "year" })}
            >
              <option value="month">Theo tháng</option>
              <option value="year">Theo năm</option>
            </select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className={labelClass}>Nhãn (badge)</label>
            <input
              className={inputClass}
              value={form.badge}
              onChange={(e) => set({ badge: e.target.value })}
              placeholder="Phổ biến"
            />
          </div>
          <div>
            <label className={labelClass}>Thứ tự</label>
            <input
              type="number"
              min={0}
              className={inputClass}
              value={form.sort_order}
              onChange={(e) => set({ sort_order: e.target.value })}
            />
          </div>
        </div>
        <div>
          <label className={labelClass}>Giới hạn (để trống = không giới hạn)</label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {LIMIT_FIELDS.map((f) => (
              <div key={f.key}>
                <span className="mb-1 block text-[11px] text-slate-400">{f.label}</span>
                <input
                  type="number"
                  min={0}
                  className={inputClass}
                  value={form.limits[f.key]}
                  onChange={(e) => set({ limits: { ...form.limits, [f.key]: e.target.value } })}
                  placeholder="∞"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <label className={labelClass}>Tính năng (mỗi dòng một mục)</label>
          <textarea
            className={inputClass}
            rows={4}
            value={form.features}
            onChange={(e) => set({ features: e.target.value })}
            placeholder={"Quản lý lớp học\nĐiểm danh học viên"}
          />
        </div>
      </div>
    </Modal>
  );
};

export default PackageFormModal;
