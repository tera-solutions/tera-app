import Card from "_common/components/Card";

import type { PaymentRecord, PaymentStatus } from "../_interface";

interface PaymentHistoryProps {
  records: PaymentRecord[];
}

const formatVnd = (n: number) => `${n.toLocaleString("vi-VN")}đ`;

const STATUS_META: Record<PaymentStatus, { label: string; className: string }> = {
  success: { label: "Thành công", className: "bg-emerald-50 text-emerald-600" },
  free: { label: "Miễn phí", className: "bg-emerald-50 text-emerald-600" },
  failed: { label: "Thất bại", className: "bg-rose-50 text-rose-600" },
};

/** Thẻ "Lịch sử thanh toán" (sidebar). */
const PaymentHistory = ({ records }: PaymentHistoryProps) => (
  <Card animated={false} className="xmd:p-5">
    <div className="mb-2 flex items-center justify-between">
      <p className="text-base font-semibold text-slate-800">Lịch sử thanh toán</p>
      <button
        type="button"
        className="text-xs font-medium text-brand transition-colors hover:underline"
      >
        Xem tất cả
      </button>
    </div>

    <div className="divide-y divide-slate-100">
      {records.map((r) => {
        const meta = STATUS_META[r.status];
        return (
          <div key={r.id} className="flex items-center justify-between gap-2 py-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {r.planName}
              </p>
              <p className="text-[11px] text-slate-400">{r.date}</p>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <span className="text-sm font-semibold text-slate-700">
                {formatVnd(r.amount)}
              </span>
              <span
                className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${meta.className}`}
              >
                {meta.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
);

export default PaymentHistory;
