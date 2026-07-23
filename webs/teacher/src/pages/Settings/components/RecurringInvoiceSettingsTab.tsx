import { useEffect, useState } from "react";
import { Button, InputNumber, notification, Toggle } from "tera-dls";

import Card from "_common/components/Card";
import FieldLabel from "_common/components/FieldLabel";
import { InvoiceConfigService } from "@tera/modules/finance";

/** Per-business "auto-generate this month's tuition invoices" setting — read
 * daily by the `invoices:generate-recurring` scheduled command. Amount is
 * derived per enrollment (price_per_lesson × sessions that fell in the
 * month), not a flat number entered here. */
const RecurringInvoiceSettingsTab = () => {
  const configQuery = InvoiceConfigService.useInvoiceConfig();
  const { mutate: updateConfig, isPending } = InvoiceConfigService.useInvoiceConfigUpdate();

  const [autoGenerate, setAutoGenerate] = useState(false);
  const [billingDay, setBillingDay] = useState(1);
  const [dueDays, setDueDays] = useState(7);

  useEffect(() => {
    const data = configQuery.data?.data;
    if (!data) return;
    setAutoGenerate(!!data.auto_generate);
    setBillingDay(data.billing_day ?? 1);
    setDueDays(data.due_days ?? 7);
  }, [configQuery.data]);

  const handleSave = () => {
    updateConfig(
      { auto_generate: autoGenerate, billing_day: billingDay, due_days: dueDays },
      {
        onSuccess: () => notification.success({ message: "Đã lưu cấu hình hóa đơn định kỳ" }),
        onError: (e: any) => notification.error({ message: e?.data?.msg ?? "Không thể lưu cấu hình" }),
      },
    );
  };

  return (
    <Card>
      <p className="mb-1 text-sm font-semibold text-slate-700">Tự động tạo hóa đơn hàng tháng</p>
      <p className="mb-4 text-xs text-slate-400">
        Vào ngày đã chọn mỗi tháng, hệ thống tự lập hóa đơn học phí cho từng học viên đang học, tính
        theo đơn giá/buổi của lượt ghi danh × số buổi học trong tháng.
      </p>

      <div className="flex flex-col gap-4 max-w-sm">
        <div className="flex items-center justify-between">
          <FieldLabel>Bật tự động tạo hóa đơn</FieldLabel>
          <Toggle checked={autoGenerate} onChange={(e) => setAutoGenerate(e.target.checked)} />
        </div>
        <div>
          <FieldLabel>Ngày lập hóa đơn hàng tháng</FieldLabel>
          <InputNumber min={1} max={28} className="w-full" value={billingDay} onChange={(v) => setBillingDay(Number(v ?? 1))} />
          <p className="mt-1 text-xs text-slate-400">Từ 1-28 để hợp lệ với mọi tháng.</p>
        </div>
        <div>
          <FieldLabel>Số ngày cho phép thanh toán</FieldLabel>
          <InputNumber min={0} max={60} className="w-full" value={dueDays} onChange={(v) => setDueDays(Number(v ?? 0))} />
        </div>
        <Button loading={isPending} onClick={handleSave} className="w-fit bg-brand hover:bg-brand/80">
          Lưu cấu hình
        </Button>
      </div>
    </Card>
  );
};

export default RecurringInvoiceSettingsTab;
