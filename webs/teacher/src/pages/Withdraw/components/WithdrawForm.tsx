import classNames from "classnames";
import { Button } from "tera-dls";

import Card from "_common/components/Card";

import { formatVnd } from "../../Wallet/_utils";
import { TRANSACTION_FEE, WITHDRAW_ENABLED } from "../constants";
import {
  formatAmountInput,
  isSubmittable,
  parseAmountInput,
  validateAmount,
} from "../_utils";

interface WithdrawFormProps {
  amount: number | null;
  onAmountChange: (amount: number | null) => void;
  note: string;
  onNoteChange: (note: string) => void;
  balance: number;
  bankAccountId: string;
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
  <div className='flex items-center justify-between gap-4 py-2.5'>
    <span className='text-sm text-slate-500'>{label}</span>
    <span className={`text-sm font-semibold ${valueClassName}`}>{value}</span>
  </div>
);

/** "Nhập thông tin rút tiền" — số tiền + nội dung + tổng kết + nút xác nhận. */
const WithdrawForm = ({
  amount,
  onAmountChange,
  note,
  onNoteChange,
  balance,
  bankAccountId,
  submitting,
  onSubmit,
}: WithdrawFormProps) => {
  const error = validateAmount(amount, balance);
  const ready = isSubmittable(amount, balance, bankAccountId);

  // Số ngoài hạn mức thì coi như chưa nhập — đừng khẳng định "nhận được 123đ" cho giá trị đang lỗi.
  const validAmount = amount !== null && !error ? amount : null;
  const received = validAmount === null ? 0 : validAmount - TRANSACTION_FEE;

  return (
    <Card className='xmd:p-5' animated={false}>
      <p className='mb-4 text-base font-semibold text-slate-800'>
        Nhập thông tin rút tiền
      </p>

      <div className='mb-1 flex items-center justify-between gap-2'>
        <label className='text-sm text-slate-500' htmlFor='withdraw-amount'>
          Số tiền rút
        </label>
        <button
          type='button'
          onClick={() => {
            const all = Math.floor(balance);
            onAmountChange(all > 0 ? all : null);
          }}
          className='text-xs font-medium text-brand transition-opacity hover:opacity-75 disabled:opacity-40'
          disabled={balance <= 0}
        >
          Tất cả
        </button>
      </div>

      <div
        className={classNames(
          "flex items-center gap-2 rounded-xl border px-3 py-2.5 transition-colors focus-within:border-blue-700",
          error ? "border-rose-300" : "border-slate-200",
        )}
      >
        <input
          id='withdraw-amount'
          type='text'
          inputMode='numeric'
          value={formatAmountInput(amount)}
          onChange={(e) => onAmountChange(parseAmountInput(e.target.value))}
          placeholder='0'
          aria-label='Số tiền rút'
          className='min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400'
        />
        <span className='shrink-0 text-sm font-medium text-slate-400'>đ</span>
      </div>

      {error ? (
        <p className='mt-2 text-xs font-medium text-rose-500'>{error}</p>
      ) : (
        <p className='mt-2 text-xs text-slate-400'>
          Số dư khả dụng: {formatVnd(balance)}
        </p>
      )}

      <div className='mt-3 divide-y divide-slate-100'>
        <Row
          label='Phí giao dịch'
          value={
            TRANSACTION_FEE === 0 ? "Miễn phí" : formatVnd(TRANSACTION_FEE)
          }
          valueClassName='text-emerald-600'
        />
        <Row
          label='Số tiền nhận được'
          value={validAmount === null ? "0đ" : formatVnd(received)}
          valueClassName='text-brand'
        />
      </div>

      <label
        className='mt-3 block text-sm text-slate-500'
        htmlFor='withdraw-note'
      >
        Nội dung (không bắt buộc)
      </label>
      <input
        id='withdraw-note'
        type='text'
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder='Nhập nội dung (nếu có)'
        maxLength={255}
        className='mt-1 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-700 outline-none transition-colors focus:border-blue-700 placeholder:text-slate-400'
      />

      <Button
        className='mt-4 w-full! justify-center! rounded-xl!'
        disabled={!WITHDRAW_ENABLED || !ready}
        loading={submitting}
        onClick={onSubmit}
      >
        Rút tiền
      </Button>

      {!WITHDRAW_ENABLED && (
        /* Nói thật thay vì để người dùng bấm một nút không bao giờ chạy. Xem `constants.ts`. */
        <p className='mt-2.5 rounded-lg bg-amber-50 px-3 py-2 text-center text-xs font-medium text-amber-700'>
          Chờ backend hỗ trợ rút tiền
        </p>
      )}
    </Card>
  );
};

export default WithdrawForm;
