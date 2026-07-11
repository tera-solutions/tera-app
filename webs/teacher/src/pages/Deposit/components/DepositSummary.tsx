import { Button, LockClosedOutlined, ShieldCheckOutlined } from "tera-dls";

import Card from "_common/components/Card";

import { formatVnd } from "../../Wallet/_utils";
import { DEPOSIT_ENABLED, TRANSACTION_FEE } from "../constants";
import { isSubmittable, validateAmount } from "../_utils";

interface DepositSummaryProps {
  amount: number | null;
  methodKey: string;
  submitting?: boolean;
  onSubmit: () => void;
}

const Row = ({
  label,
  value,
  valueClassName = "text-slate-700",
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => (
  <div className="flex items-center justify-between gap-4 py-2.5">
    <span className="text-sm text-slate-500">{label}</span>
    <span className={`text-sm font-semibold ${valueClassName}`}>{value}</span>
  </div>
);

/** "Thông tin nạp tiền" — số tiền, phí, số tiền nhận được + nút xác nhận. */
const DepositSummary = ({
  amount,
  methodKey,
  submitting,
  onSubmit,
}: DepositSummaryProps) => {
  const ready = isSubmittable(amount, methodKey);

  // Số tiền ngoài hạn mức thì coi như chưa nhập: đừng hiển thị "nhận được 123đ" cho một
  // giá trị mà form đang báo lỗi.
  const validAmount = amount !== null && !validateAmount(amount) ? amount : null;

  // ⚠️ Không cộng % ưu đãi vào đây: backend KHÔNG có API khuyến mãi nạp ví, nạp bao nhiêu nhận
  // đúng bấy nhiêu. Hứa thêm tiền trên UI là hứa sai về một con số tiền.
  const received = validAmount === null ? 0 : validAmount - TRANSACTION_FEE;

  return (
    <Card className="xmd:p-5">
      <p className="mb-2 text-base font-semibold text-slate-800">Thông tin nạp tiền</p>

      <div className="divide-y divide-slate-100">
        <Row
          label="Số tiền nạp"
          value={validAmount === null ? "—" : formatVnd(validAmount)}
          valueClassName="text-brand"
        />
        <Row
          label="Phí giao dịch"
          value={TRANSACTION_FEE === 0 ? "Miễn phí" : formatVnd(TRANSACTION_FEE)}
          valueClassName="text-emerald-600"
        />
      </div>

      <div className="mt-1 flex items-center justify-between gap-4 border-t border-slate-100 pt-3">
        <span className="text-sm font-medium text-slate-700">Số tiền nhận được</span>
        <span className="text-lg font-bold text-brand">
          {validAmount === null ? "—" : formatVnd(received)}
        </span>
      </div>

      <Button
        className="mt-4 w-full! justify-center! gap-2 rounded-xl!"
        disabled={!DEPOSIT_ENABLED || !ready}
        loading={submitting}
        onClick={onSubmit}
      >
        <LockClosedOutlined className="h-4 w-4" />
        Nạp tiền ngay
      </Button>

      {DEPOSIT_ENABLED ? (
        <p className="mt-2.5 flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <ShieldCheckOutlined className="h-4 w-4" />
          Giao dịch được bảo mật tuyệt đối
        </p>
      ) : (
        /* Nói thật với người dùng thay vì để họ bấm một nút không bao giờ chạy.
           Bỏ khi `DEPOSIT_ENABLED` bật — xem chú thích ở `constants.tsx`. */
        <p className="mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-700">
          Chờ tích hợp cổng thanh toán
        </p>
      )}
    </Card>
  );
};

export default DepositSummary;
