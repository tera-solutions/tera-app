import classNames from "classnames";
import { Button, Input } from "tera-dls";

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
  hasBankAccount: boolean;
  balance: number;
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

/** "Nhập thông tin rút tiền" — số tiền + nội dung + nút xác nhận (tài khoản nhận tiền
 * chọn/thiết lập ở `BankAccountPicker` bên cạnh, không nhập lại ở đây). */
const WithdrawForm = ({
  amount,
  onAmountChange,
  note,
  onNoteChange,
  hasBankAccount,
  balance,
  submitting,
  onSubmit,
}: WithdrawFormProps) => {
  const error = validateAmount(amount, balance);
  const ready = isSubmittable(amount, balance, hasBankAccount);

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

      <Input
        id='withdraw-amount'
        type='text'
        inputMode='numeric'
        value={formatAmountInput(amount)}
        onChange={(e) => onAmountChange(parseAmountInput(e.target.value))}
        placeholder='0'
        aria-label='Số tiền rút'
        suffix={<span className='text-sm font-medium text-slate-400'>đ</span>}
        className={classNames(
          "rounded-xl",
          error && "border-rose-300!",
        )}
      />

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
      <Input
        id='withdraw-note'
        type='text'
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder='Nhập nội dung (nếu có)'
        maxLength={255}
        className='mt-1 rounded-xl'
      />

      {!hasBankAccount && (
        <p className='mt-3 text-xs font-medium text-amber-600'>
          Vui lòng thiết lập tài khoản ngân hàng nhận tiền trước khi gửi yêu cầu.
        </p>
      )}

      <Button
        className='mt-4 w-full! justify-center! rounded-xl!'
        disabled={!WITHDRAW_ENABLED || !ready}
        loading={submitting}
        onClick={onSubmit}
      >
        Gửi yêu cầu rút tiền
      </Button>

      <p className='mt-2.5 text-center text-xs text-slate-400'>
        Yêu cầu sẽ chờ quản trị viên duyệt và chuyển khoản thủ công.
      </p>
    </Card>
  );
};

export default WithdrawForm;
