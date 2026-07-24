import { Checkbox, Input, InputNumber, PlusOutlined, Select, TrashOutlined, notification } from "tera-dls";

import { SubscriptionPackageService } from "@tera/modules/finance";

export interface DiscountRuleRow {
  type: string;
  value: number | string;
  condition?: string | null;
  enabled: boolean;
}

const RULE_TYPE_OPTIONS = [
  { value: "multi_term", label: "Giảm theo số kỳ đăng ký" },
  { value: "sibling", label: "Giảm cho HV thứ 2 trở lên (cùng PH)" },
  { value: "code", label: "Mã giảm giá riêng" },
];

interface Props {
  packageId: number;
  rules: DiscountRuleRow[];
  onChange: (rules: DiscountRuleRow[]) => void;
}

/** teacher-app-082 §5.2 — quy tắc giảm giá bật/tắt được, lưu riêng qua
 * PUT .../discount-rules/{id} (không gộp vào form thông tin gói). */
const DiscountRuleList = ({ packageId, rules, onChange }: Props) => {
  const { mutate: save, isPending } = SubscriptionPackageService.useSubscriptionPackageSetDiscountRules();

  const set = (index: number, patch: Partial<DiscountRuleRow>) =>
    onChange(rules.map((r, i) => (i === index ? { ...r, ...patch } : r)));

  const addRule = () => onChange([...rules, { type: "multi_term", value: 10, condition: "", enabled: true }]);
  const removeRule = (index: number) => onChange(rules.filter((_, i) => i !== index));

  const handleSave = () => {
    for (const rule of rules) {
      const value = Number(rule.value);
      if (Number.isNaN(value) || value < 0 || value > 100) {
        notification.warning({ message: "Phần trăm giảm giá không hợp lệ" });
        return;
      }
    }
    save(
      { id: packageId, params: { rules: rules.map((r) => ({ ...r, value: Number(r.value) })) } },
      {
        onSuccess: () => notification.success({ message: "Đã lưu quy tắc giảm giá" }),
        onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể lưu quy tắc" }),
      },
    );
  };

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-700">Giảm giá</p>
        <button
          type="button"
          onClick={addRule}
          className="flex items-center gap-1 text-xs font-medium text-brand hover:underline [&_svg]:h-3.5 [&_svg]:w-3.5"
        >
          <PlusOutlined /> Thêm quy tắc
        </button>
      </div>

      {rules.length === 0 && <p className="py-2 text-sm text-slate-400">Chưa có quy tắc giảm giá nào.</p>}

      <div className="space-y-2">
        {rules.map((rule, index) => (
          <div key={index} className="flex flex-wrap items-center gap-2 rounded-lg border border-slate-200 p-2">
            <Checkbox checked={rule.enabled} onChange={(e) => set(index, { enabled: e.target.checked })} />
            <Select
              value={rule.type}
              options={RULE_TYPE_OPTIONS}
              onChange={(v) => set(index, { type: v as string })}
              className="w-56"
            />
            <InputNumber
              min={0}
              max={100}
              value={Number(rule.value)}
              onChange={(v) => set(index, { value: v == null ? 0 : Number(v) })}
              className="w-20"
            />
            <span className="text-sm text-slate-500">%</span>
            <Input
              value={rule.condition ?? ""}
              onChange={(e) => set(index, { condition: e.target.value })}
              placeholder="Điều kiện (VD: 3 tháng)"
              className="w-48"
            />
            <button
              type="button"
              onClick={() => removeRule(index)}
              className="ml-auto flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 hover:bg-rose-50 hover:text-rose-500 [&_svg]:h-4 [&_svg]:w-4"
            >
              <TrashOutlined />
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={isPending}
        className="mt-3 rounded-lg bg-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-brand/80 disabled:opacity-50"
      >
        Lưu quy tắc giảm giá
      </button>
      <p className="mt-1 text-[11px] text-slate-400">Áp dụng cho ghi danh mới sau khi lưu.</p>
    </div>
  );
};

export default DiscountRuleList;
